import { createHash } from 'crypto';
import axios from 'axios';
import { salt_key, merchant_id } from './secret.js';
import Order from '../models/Order.js';
import AccessoryOrder from '../models/AccessoryOrder.js';


export const newPayment = async (req) => {
  if (!req.body.amount || req.body.amount < 1) {
    throw new Error("Amount must be at least ₹1.00 to proceed with payment");
  }

  const finalAmount = Math.ceil(req.body.amount * 100);
  const access_token = req.session.paymentToken;

  if (!access_token) {
    throw new Error("PhonePe token missing from session");
  }

  const merchantTransactionId = req.body.transactionId;
  const redirectBase = req.body.redirectUrl;

  const data = {
    merchantOrderId: merchantTransactionId,
    amount: finalAmount,
    expireAfter: 1200,
    metaInfo: {
      udf1: "test1",
      udf2: "new param2",
      udf3: "test3",
      udf4: "dummy value 4",
      udf5: "addition infor ref1",
    },
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Payment message used for collect requests",
      merchantUrls: {
        redirectUrl: `${redirectBase}?txnId=${merchantTransactionId}`,
      },
    },
  };

  const options = {
    method: "POST",
    url: "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${access_token}`,
    },
    data,
  };

  try {
    const response = await axios(options);

    return {
      success: true,
      url: response.data.redirectUrl, // frontend will redirect here
    };
  } catch (error) {
    console.error("PhonePe Payment Error:", error?.response?.data || error.message);

    return {
      success: false,
      message: "Payment initiation failed",
      error: error?.response?.data || error.message,
    };
  }
};

export const checkStatus = async (req, res) => {
    const { txnId } = req.params;

    if (!req.session?.paymentToken) {
        return res.status(401).json({
            success: false,
            message: "PhonePe token missing from session"
        });
    }

    const accessToken = req.session.paymentToken;
    const apiUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${txnId}/status`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${accessToken}`,
            },
            params: {
                details: 'false',
                errorContext: 'false',
            },
        });

        const paymentStatus = response.data;
        const state = paymentStatus.state;

        let newStatus = null;
        if (state === 'COMPLETED') newStatus = 'completed';
        else if (state === 'PENDING') newStatus = 'pending';
        else if (state === 'FAILED') newStatus = 'failed';
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID or unknown status',
            });
        }

        let updated = false;

        // Try updating Order
        const updatedOrder = await Order.findOneAndUpdate(
            { transactionId: txnId },
            { status: newStatus },
            { new: true }
        );
        if (updatedOrder) updated = true;

        // Try updating AccessoryOrder
        if (!updated) {
            const updatedAccessory = await AccessoryOrder.findOneAndUpdate(
                { transactionId: txnId },
                { status: newStatus },
                { new: true }
            );
            if (updatedAccessory) updated = true;
        }

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Order not found with the given transaction ID'
            });
        }

        return res.status(newStatus === 'completed' ? 200 : 400).json({
            success: newStatus !== 'failed',
            message: newStatus === 'completed' ? 'Payment successful'
                     : newStatus === 'pending' ? 'Payment is pending'
                     : 'Payment failed',
            details: paymentStatus.paymentDetails || null,
        });

    } catch (error) {
        console.error("Payment Status API Error:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to check payment status',
            error: error.message,
        });
    }
};