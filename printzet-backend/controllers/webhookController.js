import crypto from 'crypto';
import Order from '../models/Order.js';
import AccessoryOrder from '../models/AccessoryOrder.js';

export const handleWebhook = async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const username = 'theprince29';
        const password = 'kP9dX2vM7qRtL1HbW3AZ';

        const calculatedAuth = crypto
            .createHash('sha256')
            .update(`${username}:${password}`)
            .digest('hex');

        if (authorization !== calculatedAuth) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { event, payload } = req.body;

        switch (event) {
            case 'checkout.order.completed':
                await handleOrderUpdate(payload, 'completed');
                break;
            case 'checkout.order.failed':
                await handleOrderUpdate(payload, 'failed');
                break;
            default:
                return res.status(400).json({ error: 'Unsupported event type' });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Webhook handler error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleOrderUpdate = async (payload, status) => {
    const { merchantOrderId, state } = payload;

    if (state !== status.toUpperCase()) {
        console.warn(`State mismatch: expected ${status.toUpperCase()} but got ${state}`);
        return;
    }

    let updated = false;

    const updatedOrder = await Order.findOneAndUpdate(
        { transactionId: merchantOrderId },
        { status },
        { new: true }
    );
    if (updatedOrder) updated = true;

    if (!updated) {
        const updatedAccessory = await AccessoryOrder.findOneAndUpdate(
            { transactionId: merchantOrderId },
            { status },
            { new: true }
        );
        if (updatedAccessory) updated = true;
    }

    if (!updated) {
        console.warn(`⚠️ No order found for transaction ID: ${merchantOrderId}`);
    } else {
        console.log(`✅ Order status updated to '${status}' for: ${merchantOrderId}`);
    }
};
