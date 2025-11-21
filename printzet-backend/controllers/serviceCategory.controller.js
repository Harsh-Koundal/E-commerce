import { Service } from "../models/serviceCategory.model.js";
import sendResponse from "../utils/sendResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new service category
const createServiceCategory = async (req, res) => {
    try {
        const { name, description, paperSize, tShirtSizes, costperCopy } = req.body;

        const image = req.file ? req.file.path : null;      

        if (!name || !description || !image) {
            return res.status(400).json({ message: "Name, description, and image are required." });
        }

        const uploadResult = await uploadOnCloudinary(image);
        if (!uploadResult) {    
            return res.status(500).json({ message: "Image upload failed." });
        }
        const imageData = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
        };

        if (typeof costperCopy !== "string") {
            try {
                costperCopy = await JSON.parse(costperCopy);
            } catch (e) {
                return costperCopy; 
            }
        }

        const newService = new Service({ name, description, image:imageData, paperSize, tShirtSizes, costperCopy });
        await newService.save();
        return sendResponse(res, 201, "Service category created successfully", "success", newService);
    } catch (error) {
        console.error("Error creating service category:", error);
        return sendResponse(res, 400, "Error creating service category", "error", error);
    }
}   

// Get all service categories
const getAllServiceCategories = async (req, res) => {   
    try {
        const services = await Service.find();
        return sendResponse(res, 200, "Service categories fetched successfully", "success", services);
    } catch (error) {
        return sendResponse(res, 500, "Error fetching service categories", "error", error);
    }
}

// Get a single service category by ID
const getServiceCategoryById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service category not found." });
        }
        return sendResponse(res, 200, "Service category fetched successfully", "success", service);
    } catch (error) {
        return sendResponse(res, 500, "Error fetching service category", "error", error);
    }
}

// Update a service category by ID
const updateServiceCategory = async (req, res) => {
    try {
        const { name, description, paperSize, tShirtSizes, costperCopy } = req.body;

        let image = null;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (!uploadResult) {
                return res.status(500).json({ message: "Image upload failed." });
            }
            image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
            };
        } else {
            const existingService = await Service.findById(req.params.id);  
            if (existingService) {
                image = existingService.image;
            }
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { name, description, image, paperSize, tShirtSizes, costperCopy },
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ message: "Service category not found." });
        }
        return sendResponse(res, 200, "Service category updated successfully", "success", service);
    } catch (error) {
        return sendResponse(res, 400, "Error updating service category", "error", error);
    }
}

// Delete a service category by ID
const deleteServiceCategory = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service category not found." });
        }
        return sendResponse(res, 200, "Service category deleted successfully", "success");
    } catch (error) {
        return sendResponse(res, 500, "Error deleting service category", "error", error);
    }
}

export {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    updateServiceCategory,
    deleteServiceCategory
};