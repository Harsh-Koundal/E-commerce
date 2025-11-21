import Vendor from "../models/Vendor.js";
import sendResponse from "../utils/sendResponse.js";

// GET /vendor-settings/:id - Fetch vendor details by ID
const getVendorSettingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorSettings = await Vendor.findById(id);

    if (!vendorSettings) {
      return sendResponse(res, 404, "Vendor settings not found", "error");
    }

    return sendResponse(res, 200, "Vendor settings fetched successfully", "success", vendorSettings);
  } catch (error) {
    console.error("Error fetching vendor settings:", error);
    return sendResponse(res, 500, "Server Error", "error");
  }
};

// POST /vendor-settings - Create new vendor
const createVendorSettings = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phone,
      websiteUrl,
      accountHolderName,
      bankAccountNumber,
      ifscCode,
      bankName,
      companyRegistrationNumber,
      gstOrTaxId,
      panNumber,
      street,
      city,
      state,
      postalCode,
      country,
      password,
      serviceablePincodes,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "businessName",
      "email",
      "phone",
      "password",
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return sendResponse(
        res,
        400,
        `Missing required fields: ${missingFields.join(", ")}`,
        "error"
      );
    }

    // Check if vendor with this email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return sendResponse(res, 409, "Vendor with this email already exists", "error");
    }

    const vendor = new Vendor({
      businessName,
      email,
      phone,
      websiteUrl,
      password,
      serviceablePincodes,
      bankingDetails: {
        accountHolderName,
        bankAccountNumber,
        ifscCode,
        bankName,
      },
      companyInfo: {
        companyRegistrationNumber,
        gstOrTaxId,
        panNumber,
      },
      vendorAddress: {
        street,
        city,
        state,
        postalCode,
        country,
      },
    });

    const savedVendor = await vendor.save();
    return sendResponse(res, 201, "Vendor created successfully", "success", savedVendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, `Validation Error: ${validationErrors.join(", ")}`, "error");
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return sendResponse(res, 409, "Email already exists", "error");
    }
    
    return sendResponse(res, 500, "Server Error", "error");
  }
};

// PATCH /vendor-settings/:id - Update vendor by ID
const updateVendorSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Map possible flat fields into nested structures if provided
    const nestedUpdates = {};
    const bankingKeys = ["accountHolderName", "bankAccountNumber", "ifscCode", "bankName"];
    const companyKeys = ["companyRegistrationNumber", "gstOrTaxId", "panNumber"];
    const addressKeys = ["street", "city", "state", "postalCode", "country"];

    bankingKeys.forEach(k => {
      if (updateData[k] !== undefined) {
        nestedUpdates["bankingDetails." + k] = updateData[k];
        delete updateData[k];
      }
    });
    companyKeys.forEach(k => {
      if (updateData[k] !== undefined) {
        nestedUpdates["companyInfo." + k] = updateData[k];
        delete updateData[k];
      }
    });
    addressKeys.forEach(k => {
      if (updateData[k] !== undefined) {
        nestedUpdates["vendorAddress." + k] = updateData[k];
        delete updateData[k];
      }
    });

    const vendorSettings = await Vendor.findByIdAndUpdate(
      id,
      { $set: { ...updateData, ...nestedUpdates } },
      { new: true, runValidators: true }
    );

    if (!vendorSettings) {
      return sendResponse(res, 404, "Vendor settings not found", "error");
    }

    return sendResponse(res, 200, "Vendor updated successfully", "success", vendorSettings);
  } catch (error) {
    console.error("Error updating vendor:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, `Validation Error: ${validationErrors.join(", ")}`, "error");
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return sendResponse(res, 409, "Email already exists", "error");
    }
    
    return sendResponse(res, 500, "Server Error", "error");
  }
};

// DELETE /vendor-settings/:id - Delete vendor by ID
const deleteVendorSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorSettings = await Vendor.findByIdAndDelete(id);

    if (!vendorSettings) {
      return sendResponse(res, 404, "Vendor settings not found", "error");
    }

    return sendResponse(res, 200, "Vendor deleted successfully", "success");
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return sendResponse(res, 500, "Server Error", "error");
  }
};

export {
  getVendorSettingsById,
  createVendorSettings,
  updateVendorSettings,
  deleteVendorSettings,
};

