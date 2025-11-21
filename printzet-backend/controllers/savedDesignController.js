import SavedDesign from "../models/SavedDesign.js";

// CREATE
export const createSavedDesign = async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;
    const design = new SavedDesign({
      user: req.user.id,
      title,
      imageUrl,
      description,
    });
    await design.save();
    res.status(201).json(design);
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ message: "Failed to save design" });
  }
};

// READ ALL
export const getSavedDesigns = async (req, res) => {
  try {
    const designs = await SavedDesign.find({ user: req.user.id });
    res.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ message: "Failed to fetch designs" });
  }
};

// READ SINGLE
export const getSingleSavedDesign = async (req, res) => {
  try {
    const design = await SavedDesign.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json(design);
  } catch (error) {
    console.error("Error fetching design:", error);
    res.status(500).json({ message: "Failed to fetch design" });
  }
};

// UPDATE
export const updateSavedDesign = async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;
    const updated = await SavedDesign.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, imageUrl, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Design not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating design:", error);
    res.status(500).json({ message: "Failed to update design" });
  }
};

// DELETE
export const deleteSavedDesign = async (req, res) => {
  try {
    const deleted = await SavedDesign.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Design not found" });
    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    res.status(500).json({ message: "Failed to delete design" });
  }
};
