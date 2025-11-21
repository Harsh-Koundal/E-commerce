import mongoose from "mongoose";

const accessoryCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  image: String,

  subcategories: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: String,
      image: String,
      material: String,
      sizeOptions: [String],
      colorOptions: [String],
      customizationOptions: String,
      baseCost: Number,
      customizationCosts: { type: mongoose.Schema.Types.Mixed },
      availableSizes: [String],
      availableColors: [String],
    },
  ],

  dynamicPricing: Boolean,
  cost: Number,
});

const AccessoryCategory = mongoose.model("AccessoryCategory", accessoryCategorySchema);
export default AccessoryCategory;
