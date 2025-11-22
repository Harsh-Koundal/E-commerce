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