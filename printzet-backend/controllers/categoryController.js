import Category from "../models/Category.js";
import sendResponse from "../utils/sendResponse.js";

const category = async (req, res) => {
  try {
    const categories = await Category.find();
    // res.json(categories);
   return sendResponse(res, 200, "Categories fetched successfully", "success", categories);

  } catch (error) {
    // res.status(500).json({ message: "Error fetching categories", error });
   return sendResponse(res, 500, "Error fetching categories", "error", error);
  }
}

const categoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ id });

    if (!category) {
     return sendResponse(res, 404, "Category not found", "error");
      // return res.status(404).json({ message: "Category not found" });
    }

    // res.json(category);
    return sendResponse(res, 200, "Category fetched successfully", "success", category);
  } catch (error) {
    // res.status(500).json({ message: "Error fetching category", error });
    return sendResponse(res, 500, "Error fetching category", "error", error);

  }
}

export { category, categoryById };