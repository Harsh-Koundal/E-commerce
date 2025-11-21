import paymentModel from "../models/payment.model.js";
import sendResponse from "../utils/sendResponse.js";
import { phonePeAuthMiddleware } from '../middleware/phonepeAuthMiddleware.js';
import { newPayment } from '../controllers/phonepayController.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await paymentModel.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  } 
};

export const createPayout = async (req, res) => {
    try {
        const { vendorId, amount, paymentMethod, referenceId } = req.body;
        if (!vendorId || !amount || !paymentMethod) {
            return res.status(400).json({ message: "vendorId, amount, and paymentMethod are required" });
        }

        const transactionId = uuidv4();
        req.body.transactionId = transactionId;
        req.body.redirectUrl = `${process.env.FRONTEND_URL}/payment-status`;  

        const newPayout = new paymentModel({
            type: "VENDOR_PAYMENT",
            vendorId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus: "PENDING",
            referenceId : referenceId || null,
        });
        await newPayout.save();

        await phonePeAuthMiddleware(req, res, async () => {
            await newPayment(req, res);
        });

        return sendResponse(res, 201, true, "Payout created", newPayout);
    } catch (error) {
        console.error("Error creating payout:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};

export const processRefund = async (req, res) => {
    try {
        const { transactionId, amount, reason } = req.body;
        if (!transactionId || !amount || !reason) {
            return res.status(400).json({ message: "transactionId, amount, and reason are required" });
        }
        const transaction = await paymentModel.findOne({ transactionId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        if (transaction.paymentStatus !== "SUCCESS") {
            return res.status(400).json({ message: "Only successful transactions can be refunded" });
        }
        if (transaction.refund?.isRefunded) {
            return res.status(400).json({ message: "Transaction has already been refunded" });
        }
        if (amount > transaction.amount) {
            return res.status(400).json({ message: "Refund amount cannot exceed original transaction amount" });
        }

        req.body.redirectUrl = `${process.env.FRONTEND_URL}/payment-status`;  
        
        await phonePeAuthMiddleware(req, res, async () => {
            await newPayment(req, res);
        });

        transaction.refund = {
            isRefunded: true,
            refundAmount: amount,
            refundDate: new Date(),
            reason,
            referenceId: `REF-${uuidv4()}`,
        };
        transaction.paymentStatus = "REFUNDED";
        await transaction.save();
        return res.status(200).json({ message: "Refund processed", transaction });
    } catch (error) {
        console.error("Error processing refund:", error);
        return res.status(500).json({ message: "Server error" });
    }
};