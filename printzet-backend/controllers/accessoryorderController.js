import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import AccessoryOrder from "../models/AccessoryOrder.js";
import { v4 as uuidv4 } from 'uuid';
import { phonePeAuthMiddleware } from "../middleware/phonepeAuthMiddleware.js";
import { newPayment } from "../controllers/phonepayController.js";
import sendResponse from "../utils/sendResponse.js";
dotenv.config();

// Cloudinary configuration (remains the same)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "accessory-orders",
        resource_type: "auto",
    },
});

const uploadFile = async (req, res) => {
    try {
        const files = req.files.map((file) => ({
            url: file.path,
            mimetype: file.mimetype,
            public_id: file.filename,
            originalname: file.originalname
        }));
        // res.status(200).json({ message: "Files uploaded successfully.", files });
        sendResponse(res, 200, "Files uploaded successfully.", "success", { files });

    } catch (error) {
        console.error("Error processing file upload:", error);
        // res.status(500).json({ message: "Server error" });
        sendResponse(res, 500, "Error processing file upload", "error", error);

    }
}

// Calculate accessory cost function (remains the same)
const calculateAccessoryCost = (numCopies, subCategory, material, size, color, customization) => {
    const priceData = {
        "custom-polo-t-shirts": { baseCost: 20, customizationCosts: { "Logo Placement": 5, "Text Input": 3, "Embroidery": 8, "Print Type": 6 } },
        "office-shirts": { baseCost: 25, customizationCosts: { "Logo Embroidery": 8, "Monogram": 5 } },
        "custom-t-shirts": { baseCost: 18, customizationCosts: { "Full Print": 10, "Front Print": 5, "Back Print": 5, "Specialty Print": 7 } },
        "custom-stamps-ink": { baseCost: 15, customizationCosts: { "Logo Upload": 7 } },
        "photo-gifts": { baseCost: 22, customizationCosts: { "Photo Upload": 6, "Text Input": 3 } },
        "custom-caps": { baseCost: 17, customizationCosts: { "Embroidery": 8, "Print": 5, "Patch": 7 } },
        "custom-drinkware": { baseCost: 19, customizationCosts: { "Photo Upload": 6, "Text Input": 3, "Engraving": 5 } },
        "custom-bags": { baseCost: 21, customizationCosts: { "Print": 5, "Embroidery": 7, "Pocket Prints": 6, "Zipper Colors": 4 } },
    };

    if (!priceData[subCategory]) {
        return 0;
    }

    let cost = priceData[subCategory].baseCost;
    if (priceData[subCategory].customizationCosts && customization) {
        Object.keys(customization).forEach(key => {
            if (customization[key] && priceData[subCategory].customizationCosts[key]) {
                cost += priceData[subCategory].customizationCosts[key];
            }
        });
    }

    return cost * numCopies;
};

const placeOrder = async (req, res) => {
    try {
        const { subCategory, numCopies, material, size, color, customization, additionalFields, customerDetails, vendorId } = req.body;

        // Validate customerDetails (similar to the printing route)
        if (!customerDetails ||
            !customerDetails.name ||
            !customerDetails.email ||
            !customerDetails.phone ||
            !customerDetails.address ||
            !customerDetails.city ||
            !customerDetails.state ||
            !customerDetails.pincode) {
            // return res.status(400).json({ message: "Invalid customer details" });
            return sendResponse(res, 400, "Invalid customer details", "error");

        }

        // Validate vendorId
        if (!vendorId) {
            // return res.status(400).json({ message: "Vendor ID is required" });
            return sendResponse(res, 400, "Vendor ID is required", "error");

        }

        const files = req.files.map((file) => ({
            url: file.path,
            mimetype: file.mimetype,
            public_id: file.filename,
            originalname: file.originalname
        }));

        const totalCost = calculateAccessoryCost(numCopies, subCategory, material, size, color, customization ? JSON.parse(customization) : {});
        const orderId = uuidv4();
        const transactionId = uuidv4();

        const newOrder = new AccessoryOrder({
            userId: req.user.id,
            orderId: orderId,
            subCategory,
            numCopies,
            material,
            size,
            color,
            customization: customization ? JSON.parse(customization) : {},
            additionalFields: additionalFields ? JSON.parse(additionalFields) : {},
            files,
            totalCost,
            customerDetails,
            vendor: vendorId,
            transactionId,
            paymentMethod: "UPI",
            status: "pending"
        });

        await newOrder.save();
        // Prepare PhonePe payment
        req.body.transactionId = transactionId;
        req.body.amount = totalCost;
        req.body.redirectUrl = `${process.env.FRONTEND_URL}/payment-status`;

        await phonePeAuthMiddleware(req, res, async () => {
            await newPayment(req, res);
        });
    } catch (error) {
        console.error("Error processing accessory order:", error);
        // res.status(500).json({ message: "Server error", error });
        sendResponse(res, 500, "Error processing accessory order", "error", error);

    }
}

const homeroute = async (req, res) => {
    try {
        const orders = await AccessoryOrder.find({ userId: req.user.id });
        // res.json(orders);
        sendResponse(res, 200, "Accessory orders fetched", "success", orders);

    } catch (error) {
        // res.status(500).json({ message: "Error fetching accessory orders", error });
        sendResponse(res, 500, "Failed to fetch accessory orders", "error", error);

    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await AccessoryOrder.findOne({ orderId: req.params.orderId });
        if (!order) {
            // return res.status(404).json({ message: "Accessory order not found" });
            return sendResponse(res, 404, "Accessory order not found", "error");

        }
        // res.json(order);
        sendResponse(res, 200, "Accessory order details", "success", order);

    } catch (error) {
        // res.status(500).json({ message: "Error fetching accessory order", error });
        sendResponse(res, 500, "Failed to fetch accessory order", "error", error);

    }
}

export {
    uploadFile,
    placeOrder,
    homeroute,
    getOrderById,
    calculateAccessoryCost
}