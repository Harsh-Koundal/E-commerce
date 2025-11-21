import VendorService from "../models/VendorService.js";
import sendResponse from "../utils/sendResponse.js";

const postVendorService = async (req, res) => {
  try {
    const { name, description, price,status } = req.body;

    const newService = new VendorService({
      vendor: req.vendor._id,
      name,
      description,
      price,
      status,
    });

    await newService.save();
    res
      .status(201)
      .json({ message: "Service submitted for approval", service: newService });
  } catch (error) {
    console.error("Service submission error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getVendorServices = async (req, res) => {
  try {
    const services = await VendorService.find({ vendor: req.vendor._id });
    res.json({ services });
  } catch (error) {
    console.error("Fetch services error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const updateVendorService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, price, status } = req.body;

    const service = await VendorService.findOne({ _id: serviceId, vendor: req.vendor._id });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.status = status || service.status;

    await service.save();
    return sendResponse(res, 200, true, { service }, null, "Service updated successfully");
  } catch (error) {
    console.error("Update service error:", error);
    return sendResponse(res, 500, false, null, "Internal Server Error", "Failed to update service");
  }
}

const deleteVendorService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await VendorService.findOneAndDelete({ _id: serviceId, vendor: req.vendor._id });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return sendResponse(res, 200, true, null, null, "Service deleted successfully");
  } catch (error) {
    console.error("Delete service error:", error);
    return sendResponse(res, 500, false, null, "Internal Server Error", "Failed to delete service");
  }
}

export { postVendorService, getVendorServices, updateVendorService, deleteVendorService };