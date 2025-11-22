import AccessoryCategory from "../models/AccessoryCategory.js";
import sendResponse from "../utils/sendResponse.js";

const getAccessoryCategory = async (req, res) => {
    try {
      const accessoryCategory = await AccessoryCategory.findOne({
        id: "accessory-printing",
      });  
      if (!accessoryCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", accessoryCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getAccessoryCategory };

const getClothingCategory = async (req, res) => {
    try {
      const clothingCategory = await AccessoryCategory.findOne({
        id: "clothing-printing",
      });  
      if (!clothingCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", clothingCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getClothingCategory};

const getStationeryCategories = async (req, res) => {
    try {
      const stationeryCategory = await AccessoryCategory.findOne({
        id: "stationery-printing",
      });  
      if (!stationeryCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", stationeryCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getStationeryCategories};

const getStampInkCategories = async (req, res) => {
    try {
      const stampsCategory = await AccessoryCategory.findOne({
        id: "stamp-ink-printing",
      });  
      if (!stampsCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", stampsCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getStampInkCategories};


const getPosterSignsCategories = async (req, res) => {
    try {
      const posterCategory = await AccessoryCategory.findOne({
        id: "poster-signs-printing",
      });  
      if (!posterCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", posterCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getPosterSignsCategories};

const getLabelStickerPackagingCategories = async (req, res) => {
    try {
      const posterCategory = await AccessoryCategory.findOne({
        id: "label-sticker-packaging",
      });  
      if (!posterCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", posterCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getLabelStickerPackagingCategories};

const getMugsAlbumGiftCategories = async (req, res) => {
    try {
      const mugsCategory = await AccessoryCategory.findOne({
        id: "mugs-albums-gifts",
      });  
      if (!mugsCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", mugsCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getMugsAlbumGiftCategories};

const getCustomDrinkwareCategories = async (req, res) => {
    try {
      const drinkwareCategory = await AccessoryCategory.findOne({
        id: "custom-drinkware",
      });  
      if (!drinkwareCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", drinkwareCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getCustomDrinkwareCategories};

const getContactCardCategories = async (req, res) => {
    try {
      const contactCategory = await AccessoryCategory.findOne({
        id: "contact-cards",
      });  
      if (!contactCategory) {
        console.log("Category not found!");
        // return res.status(404).json({ message: "Accessory category not found" });
        return sendResponse(res, 404, "Accessory category not found", "error");
      }
  
      // res.json(accessoryCategory);
      return sendResponse(res, 200, "Accessory category fetched", "success", contactCategory);
    } catch (error) {
      console.error("Error fetching accessory category:", error);
      // res
      //   .status(500)
      //   .json({ message: "Error fetching accessory category", error });
      return sendResponse(res, 500, "Error fetching accessory category", "error", error);
    }
}

export { getContactCardCategories};