import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import pdf from "pdf-parse";
import mammoth from "mammoth";
//import fs from "fs";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import sendOrderConfirmationEmail from "../utils/sendemail.js";
//import sendWhatsAppMsg from "../utils/sendWhatsAppMsg.js";
import { phonePeAuthMiddleware } from '../middleware/phonepeAuthMiddleware.js';
import { newPayment } from '../controllers/phonepayController.js';
import sendResponse from "../utils/sendResponse.js";
import { type } from "os";
import Payment from "../models/payment.model.js";
import cloudinary from "../config/cloudinaryConfig.js"

dotenv.config();

// Memory storage for processing files first
const memoryStorage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Max 10 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed!'), false);
        }
    }
});

// Function to extract page count from buffer
const extractPageCount = async (buffer, mimetype, originalname) => {
    try {
        console.log(`Processing: ${originalname} (${mimetype})`);

        if (mimetype === "application/pdf") {
            const data = await pdf(buffer);
            const pageCount = data.numpages || 1;
            console.log(`PDF: ${originalname} → ${pageCount} pages`);
            return pageCount;
        }

        if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ buffer });
            const text = result.value;
            const wordsPerPage = 250; // Average words per page
            const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
            const pageCount = Math.max(1, Math.ceil(wordCount / wordsPerPage));
            console.log(`DOCX: ${originalname} → ${wordCount} words ≈ ${pageCount} pages`);
            return pageCount;
        }

        if (mimetype === "application/msword") {
            // For .doc files, use size estimation
            const sizeInKB = buffer.length / 1024;
            const estimatedPages = Math.max(1, Math.ceil(sizeInKB / 50)); // Rough estimate
            console.log(`DOC: ${originalname} → ~${estimatedPages} pages (estimated)`);
            return estimatedPages;
        }

        console.log(`Unknown file type: ${mimetype}, defaulting to 1 page`);
        return 1;

    } catch (error) {
        console.error(`Error processing ${originalname}:`, error.message);
        return 1; // Default to 1 page if processing fails
    }
};

// Function to upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, originalname, mimetype) => {
    return new Promise((resolve, reject) => {
        // Clean filename for public_id
        const cleanName = originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const publicId = `${Date.now()}_${cleanName}`;

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "user_uploads",
                resource_type: "raw", // Important for PDF/DOCX
                public_id: publicId,
                access_mode: "public", // Make it publicly accessible
            },
            (error, result) => {
                if (error) {
                    console.error(`Upload failed for ${originalname}:`, error.message);
                    reject(error);
                } else {
                    console.log(`Uploaded: ${originalname} → ${result.secure_url}`);
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
};

// LEGACY: Keep the old getTotalPages function for backward compatibility
const getTotalPages = async (file) => {
    try {
        if (!file || !file.url) {
            console.error("File URL is missing");
            return 1;
        }

        let dataBuffer;
        const fileUrl = file.url;

        console.log(`Fetching file from Cloudinary URL: ${fileUrl}`);

        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000
        });

        dataBuffer = Buffer.from(response.data);

        if (file.mimetype === "application/pdf") {
            const data = await pdf(dataBuffer);
            return data.numpages || 1;
        }

        if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ buffer: dataBuffer });
            const text = result.value;
            const wordsPerPage = 250;
            const wordCount = text.split(/\s+/).length;
            return Math.max(1, Math.ceil(wordCount / wordsPerPage));
        }

        return 1;
    } catch (error) {
        console.error("Error counting pages:", error.message);

        if (error.code === 'ENOTFOUND' || error.response?.status === 403) {
            try {
                console.log("Trying with signed URL...");
                const signedUrl = cloudinary.utils.private_download_url(file.public_id, "raw");

                const response = await axios.get(signedUrl, {
                    responseType: "arraybuffer",
                    timeout: 30000
                });

                const dataBuffer = Buffer.from(response.data);

                if (file.mimetype === "application/pdf") {
                    const data = await pdf(dataBuffer);
                    return data.numpages || 1;
                }

                if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const result = await mammoth.extractRawText({ buffer: dataBuffer });
                    const text = result.value;
                    const wordsPerPage = 250;
                    const wordCount = text.split(/\s+/).length;
                    return Math.max(1, Math.ceil(wordCount / wordsPerPage));
                }

                return 1;
            } catch (signedError) {
                console.error("Signed URL also failed:", signedError.message);
                return 1;
            }
        }

        return 1;
    }
};


// Function to calculate cost
const calculateCost = (numCopies, totalPages, colorType, paperType, binding, lamination, printedSides, subCategory) => {
    const priceData = {
        "document-printing": {
            "75GSM - Normal Paper": { blackWhite: { singleSide: 0.99, backToBack: 0.89 }, color: { singleSide: 5.75, backToBack: 5.25 } },
            "100GSM - Duo Paper": { blackWhite: { singleSide: 2.5, backToBack: 2 }, color: { singleSide: 7, backToBack: 7 } },
        },
        "letterhead-printing": {
            "75GSM - Normal Paper": { color: { singleSide: 5.75 } },
            "100GSM - Duo Paper": { color: { singleSide: 6.66 } },
        },
        "certificates-printing": {
            "250GSM - Matte Paper": { blackWhite: { singleSide: 14 }, color: { singleSide: 21 } },
            "250GSM - Glossy Paper": { blackWhite: { singleSide: 14 }, color: { singleSide: 21 } },
            "300GSM - Matte Paper": { blackWhite: { singleSide: 15 }, color: { singleSide: 23 } },
            "300GSM - Glossy Paper": { blackWhite: { singleSide: 15 }, color: { singleSide: 22.5 } },
        },
        "visiting-printing": {
            "75GSM - Normal Paper": { blackWhite: { singleSide: 5.75, backToBack: 5.25 }, color: { singleSide: 5.75, backToBack: 5.25 } },
            "100GSM - Duo Paper": { blackWhite: { singleSide: 7, backToBack: 7 }, color: { singleSide: 7, backToBack: 7 } },
        },
        "poster-printing": {
            "250GSM - Matte Paper": { blackWhite: { singleSide: 23 }, color: { singleSide: 37.5 } },
            "250GSM - Glossy Paper": { blackWhite: { singleSide: 23 }, color: { singleSide: 37.5 } },
            "300GSM - Matte Paper": { blackWhite: { singleSide: 25 }, color: { singleSide: 45 } },
            "300GSM - Glossy Paper": { blackWhite: { singleSide: 25 }, color: { singleSide: 45 } },
        },
        "leaflet-flyers-pamphlet-printing": {
            "130GSM - Matte Paper": { blackWhite: { singleSide: 11, backToBack: 9 }, color: { singleSide: 15, backToBack: 13.5 } },
            "130GSM - Glossy Paper": { blackWhite: { singleSide: 11, backToBack: 9 }, color: { singleSide: 15, backToBack: 13.5 } },
            "170GSM - Matte Paper": { blackWhite: { singleSide: 12.5, backToBack: 10 }, color: { singleSide: 15, backToBack: 13.5 } },
            "170GSM - Glossy Paper": { blackWhite: { singleSide: 12.5, backToBack: 10 }, color: { singleSide: 18, backToBack: 16.2 } },
        },
        "notebook-printing": {
            "75GSM - Normal Paper": { blackWhite: { singleSide: 0.99, backToBack: 0.89 }, color: { singleSide: 5.75, backToBack: 5.25 } },
            "100GSM - Duo Paper": { blackWhite: { singleSide: 2.5, backToBack: 2 }, color: { singleSide: 7, backToBack: 7 } },
        },
        "brochure-printing": {
            "75GSM - Normal Paper": { blackWhite: { singleSide: 5.75, backToBack: 5.25 }, color: { singleSide: 5.75, backToBack: 5.25 } },
            "100GSM - Duo Paper": { blackWhite: { singleSide: 7, backToBack: 7 }, color: { singleSide: 7, backToBack: 7 } },
        },
        "photo-album-printing": {
            "130GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
            "130GSM - Glossy Paper": { color: { singleSide: 15, backToBack: 13.5 } },
            "170GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
            "170GSM - Glossy Paper": { color: { singleSide: 18, backToBack: 16.2 } },
            "220GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
            "250GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
            "250GSM - Glossy Paper": { color: { singleSide: 21, backToBack: 18.9 } },
            "300GSM - Matte Paper": { color: { singleSide: 23, backToBack: 20.7 } },
            "300GSM - Glossy Paper": { color: { singleSide: 22.5, backToBack: 20.25 } },
        },
    };

    const bindingOptions = { "No Binding": 0, "Spiral Binding": 10, "Hard Binding": 25, "Soft Binding": 15 };
    const laminationOptions = { "None": 0, "Glossy": 5, "Matte": 5 };
    const colorTypes = { "blackWhite": "blackWhite", "color": "color" };
    const printedSidesOptions = { "SingleSide": "singleSide", "BacktoBack": "backToBack" };

    const categoryKey = subCategory.replace("-printing", "");
    const paperCost = priceData[subCategory] && priceData[subCategory][paperType];
    const colorKey = colorTypes[colorType];
    const sideKey = printedSidesOptions[printedSides];

    let cost = 0;
    if (paperCost && paperCost[colorKey] && paperCost[colorKey][sideKey]) {
        cost = totalPages * paperCost[colorKey][sideKey];
    } else if (paperCost && paperCost.color && paperCost.color.singleSide) {
        cost = totalPages * paperCost.color.singleSide;
    }

    cost += bindingOptions[binding] || 0;
    cost += laminationOptions[lamination] || 0;
    cost *= numCopies;
    return cost;
};

const upload_files = async (req, res) => {
    memoryStorage.array("files")(req, res, async (uploadError) => {
        if (uploadError) {
            console.error("File upload error:", uploadError.message);
            return sendResponse(res, 400, "File upload error", null, uploadError.message);
        }

        if (!req.files || req.files.length === 0) {
            return sendResponse(res, 400, "No files uploaded");
        }

        try {
            const processedFiles = [];
            let totalPages = 0;

            console.log(`Processing ${req.files.length} files...`);

            // Process each file: Extract pages → Upload to Cloudinary
            for (const file of req.files) {
                try {
                    // Step 1: Extract page count from buffer
                    const pageCount = await extractPageCount(
                        file.buffer,
                        file.mimetype,
                        file.originalname
                    );

                    // Step 2: Upload buffer to Cloudinary
                    const uploadResult = await uploadToCloudinary(
                        file.buffer,
                        file.originalname,
                        file.mimetype
                    );

                    // Step 3: Store the results
                    const processedFile = {
                        url: uploadResult.secure_url,
                        mimetype: file.mimetype,
                        public_id: uploadResult.public_id,
                        originalname: file.originalname,
                        pageCount: pageCount,
                        fileSize: file.size
                    };

                    processedFiles.push(processedFile);
                    totalPages += pageCount;

                    console.log(`Complete: ${file.originalname} → ${pageCount} pages → ${uploadResult.secure_url}`);

                } catch (fileError) {
                    console.error(`Failed to process ${file.originalname}:`, fileError.message);

                    // Still try to upload the file even if page extraction fails
                    try {
                        const uploadResult = await uploadToCloudinary(
                            file.buffer,
                            file.originalname,
                            file.mimetype
                        );

                        processedFiles.push({
                            url: uploadResult.secure_url,
                            mimetype: file.mimetype,
                            public_id: uploadResult.public_id,
                            originalname: file.originalname,
                            pageCount: 1, // Default to 1 if extraction failed
                            fileSize: file.size,
                            extractionError: true
                        });

                        totalPages += 1;

                    } catch (uploadError) {
                        console.error(`Both extraction and upload failed for ${file.originalname}`);
                        // Skip this file entirely
                    }
                }
            }

            if (processedFiles.length === 0) {
                return sendResponse(res, 500, "Failed to process any files");
            }

            console.log(`Processing complete: ${processedFiles.length} files, ${totalPages} total pages`);

            sendResponse(res, 200, "Files uploaded and pages counted", "success", {
                totalPages,
                fileCount: processedFiles.length,
                files: processedFiles
            });

        } catch (error) {
            console.error("Unexpected error during file processing:", error);
            sendResponse(res, 500, "Error processing files", null, error.message);
        }
    });
}

const place_order = async (req, res) => {
    try {
        const { orders = [], customerDetails, vendorId } = req.body;

        // Validate customer details
        if (
            !customerDetails ||
            !customerDetails.name ||
            !customerDetails.email ||
            !customerDetails.phone ||
            !customerDetails.address ||
            !customerDetails.city ||
            !customerDetails.state ||
            !customerDetails.pincode
        ) {
            return sendResponse(res, 400, "Invalid customer details");
        }

        if (!Array.isArray(orders) || orders.length === 0) {
            return sendResponse(res, 400, "No orders provided");
        }

        const createdOrders = [];

        for (const order of orders) {
            const {
                categoryId,
                subCategory,
                numCopies,
                paperType,
                binding,
                lamination,
                printedSides,
                colorType,
                files = []
            } = order;

            // Validate printing options
            if (
                typeof paperType !== 'string' ||
                typeof binding !== 'string' ||
                typeof lamination !== 'string' ||
                typeof colorType !== 'string' ||
                typeof printedSides !== 'string'
            ) {
                return sendResponse(res, 400, "Invalid printing options in one of the orders");
            }

            // Process files

            let totalPages = 0;
            const processedFiles = files.map(file => {
                totalPages += file.pageCount || 0;
                return {
                    url: file.url,
                    public_id:  "jhgjhh",
                    mimetype: file.mimetype || "application/pdf",
                    originalname: file.originalname || file.name || "file.pdf"
                };
            });

            const totalCost = calculateCost(
                numCopies,
                totalPages,
                colorType,
                paperType,
                binding,
                lamination,
                printedSides,
                subCategory
            );

            const orderId = uuidv4();
            const transactionId = uuidv4();

            const newOrder = new Order({
                userId: req.user.id,
                categoryId,
                subCategory,
                numCopies,
                colorType,
                paperType,
                binding,
                lamination,
                printedSides,
                files: processedFiles,
                totalPages,
                totalCost,
                customerDetails: customerDetails,
                vendor: vendorId || null,
                orderId,
                transactionId,
                paymentMethod: "UPI",
                status: "pending"
            });

            const newTransaction = new Payment({
                type: "CUSTOMER_PAYMENT",
                userId: req.user.id,
                orderId: newOrder._id,
                vendorId: vendorId,
                amount: totalCost,
                paymentMethod: "UPI",
                transactionId,
                currency: "INR"
            });

            await newTransaction.save();
            await newOrder.save();

            createdOrders.push({
                orderId: newOrder._id,
                transactionId,
                totalCost
            });
        }

        // Prepare request for PhonePe (you can choose first order's transaction or combine amounts)
        const paymentData = await newPayment({
            ...req,
            body: {
                transactionId: createdOrders[0].transactionId,
                amount: createdOrders.reduce((acc, o) => acc + o.totalCost, 0),
                redirectUrl: `${process.env.FRONTEND_URL}/payment-status`
            }
        });

        sendResponse(res, 201, "Orders created, waiting for payment", null, {
            orders: createdOrders,
            url: paymentData.url
        });
    } catch (error) {
        console.error("Error placing order:", error);
        sendResponse(res, 500, "Error placing order", null, error);
    }
};




const getOrder = async (req, res) => {
    try {

        // Get the correct user ID (handle both regular and Google auth)
        const userId = req.userId || req.user?.id;
        
        // First get all successful payment records for this user
        const successfulPayments = await Payment.find({ 
            userId: userId, 
            paymentStatus: "SUCCESS" 
        }).select("orderId");
        
        // Extract order IDs from successful payments
        const paidOrderIds = successfulPayments.map(payment => payment.orderId);
        
        // Find orders that have successful payments
        const orders = await Order.find({ 
            userId: userId,
            _id: { $in: paidOrderIds }
        })
            .populate("categoryId", "name description")
            .populate("vendor", "name email phone address")
            .populate("assignedAgent", "name phone")
            .sort({ createdAt: -1 });
        
        sendResponse(res, 200, "Orders fetched successfully","success", orders);

    } catch (error) {
        sendResponse(res, 500, "Error fetching orders", null, error);
    }
}


const getSingleOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate("categoryId", "name description")
            .populate("vendor", "name email phone address")
            .populate("assignedAgent", "name phone");
        
        if (!order) {
            return sendResponse(res, 404, "Order not found");
        }

        
        // Check if the order has a successful payment
        const payment = await Payment.findOne({ 
            orderId: order._id, 
            paymentStatus: "SUCCESS" 
        });
        
        if (!payment) {
            return sendResponse(res, 404, "Order not found or payment not completed");
        }
        
        sendResponse(res, 200, "Order fetched","success", order);

    } catch (error) {
        sendResponse(res, 500, "Error fetching order", null, error);
    }
}

const orderController = {
    upload_files,
    place_order,
    getOrder,
    getSingleOrderById
}
//get  unassigned orders 
export const getUnassignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      assignedAgent: null,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching unassigned orders:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching unassigned orders",
    });
  }
};


export default orderController;