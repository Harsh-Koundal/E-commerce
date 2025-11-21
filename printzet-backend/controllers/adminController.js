import User from "../models/User.js";
import Order from "../models/Order.js";
import AccessoryOrder from "../models/AccessoryOrder.js"
import authMiddleware from "../middleware/authMiddleware.js";
import Vendor from "../models/Vendor.js";
import sendResponse from "../utils/sendResponse.js";


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        // res.json(users);
        sendResponse(res, 200, "Users fetched successfully", "success", users);
    } catch (error) {
        console.error("Error fetching users:", error);
        // res.status(500).json({ message: "Error fetching users", error: error.message });
        sendResponse(res, 500, "Error fetching users", "error", error.message);
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
            .populate("userId categoryId vendor");

        const ordersWithCloudinaryLinks = orders.map((order) => ({
            ...order.toObject(),
            files: order.files,
        }));
        // console.log(ordersWithCloudinaryLinks);

        // res.json(ordersWithCloudinaryLinks);
        sendResponse(res, 200, "Orders fetched", "success", ordersWithCloudinaryLinks);
    } catch (error) {
        console.error("Error fetching orders:", error);
        // res.status(500).json({ message: "Error fetching orders", error: error.message });
        sendResponse(res, 500, "Error fetching orders", "error", error.message);
    }
}

const assignVendorToOrder = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { vendor: vendorId },
            { new: true }
        ).populate("vendor");
        sendResponse(res, 200, "Vendor assigned successfully", "success", order);
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, "Error fetching orders", "error", err.message);
    }
};

const getAllAccessoryOrders = async (req, res) => {
    try {
        const accessoryOrders = await AccessoryOrder.find().populate("userId").sort({ createdAt: -1 });
        // res.json(accessoryOrders);
        sendResponse(res, 200, "Accessory orders fetched", "success", accessoryOrders)
    } catch (error) {
        console.error("Error fetching accessory orders:", error);
        // res.status(500).json({ message: "Error fetching accessory orders", error: error.message });
        sendResponse(res, 500, "Error fetching accessory orders", "error", error.message);
    }
}

const updateUserAddress = async (req, res) => {
    const { email, address, city, state, pincode } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                address: {
                    address: address,
                    city: city,
                    state: state,
                    pincode: pincode,
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            // return res.status(404).json({ message: "User not found" });
            return sendResponse(res, 404, "User not found", "error");
        }

        // res.json(updatedUser);
        sendResponse(res, 200, "User address updated", "success", updatedUser);
    } catch (error) {
        console.error("Error updating address:", error);
        // res.status(500).json({ message: "Internal server error" });
        sendResponse(res, 500, "Error updating address", "error", error.message);
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return sendResponse(res, 404, "Order not found", "error");

        order.status = req.body.status || order.status;

        if (req.body.totalCost !== undefined) {
            if (typeof req.body.totalCost !== "number" || req.body.totalCost < 0) {
                // return res.status(400).json({ message: "Invalid total cost" });
                sendResponse(res, 404, "Invalid total cost", "error")
            }
            order.totalCost = req.body.totalCost;
        }

        await order.save();

        // res.json({ message: "Order updated", order });
        sendResponse(res, 404, "Order not found", "error");
    } catch (error) {
        console.error("Error updating order:", error);
        // res.status(500).json({ message: "Error updating order", error: error.message });
        sendResponse(res, 500, "Error updating order", "error", error.message);
    }
}

const getAccessoryOrderById = async (req, res) => {
    try {
        const order = await AccessoryOrder.findById(req.params.orderId);
        if (!order) return sendResponse(res, 404, "Accessory Order not found", "error");

        order.status = req.body.status || order.status;

        if (req.body.totalCost !== undefined) {
            if (typeof req.body.totalCost !== "number" || req.body.totalCost < 0) {
                // return res.status(400).json({ message: "Invalid total cost" });
                sendResponse(res, 200, "Accessory Order updated", "success", order);
            }
            order.totalCost = req.body.totalCost;
        }

        await order.save();

        // res.json({ message: "Accessory Order updated", order });
        sendResponse(res, 200, "Accessory Order updated", "success", order);

    } catch (error) {
        console.error("Error updating accessory order:", error);
        // res.status(500).json({ message: "Error updating accessory order", error: error.message });
        sendResponse(res, 200, "Accessory Order updated", "success", order);
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        // res.status(200).json(vendors);
        sendResponse(res, 200, "Vendors fetched successfully", "success", vendors);
    } catch (err) {
        // res.status(500).json({ error: "Failed to fetch vendors" });
        sendResponse(res, 500, "Failed to fetch vendors", "error", err.message);
    }
}

export {
    getAllUsers,
    getAllOrders,
    assignVendorToOrder,
    getAllAccessoryOrders,
    updateUserAddress,
    getOrderById,
    getAccessoryOrderById,
    getAllVendors
};