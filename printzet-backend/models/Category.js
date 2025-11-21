import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true },  
  name: { type: String, required: true },
  description: String,
  paperSize: String,
  image: String,

  subcategories: [
    {
      id: { type: String, required: true },  
      name: { type: String, required: true },
      description: String,
      image: String,
    },
  ],

  colorType: { type: mongoose.Schema.Types.Mixed },
  costPerCopy: { type: mongoose.Schema.Types.Mixed },
  paperTypes: { type: mongoose.Schema.Types.Mixed },
  printQualities: { type: mongoose.Schema.Types.Mixed },
  printedSides: { type: mongoose.Schema.Types.Mixed },
  bindingOptions: { type: mongoose.Schema.Types.Mixed },
  laminationOptions: { type: mongoose.Schema.Types.Mixed },
  pageOrientations: { type: mongoose.Schema.Types.Mixed },
  coverPages: { type: mongoose.Schema.Types.Mixed },

  dynamicPricing: Boolean,
  cost: Number,
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
