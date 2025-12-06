import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    paperSize: { type: String },
    image: { type: String },
    subcategories: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
    }],
    colorType: { type: Object },
    costPerCopy: { type: Object }, // Restructured to use subcategory IDs as keys
    paperTypes: { type: Object },
    printQualities: { type: Object },
    printedSides: { type: Object },
    bindingOptions: { type: Object },
    laminationOptions: { type: Object },
    pageOrientations: { type: Object },
    printedSides: { type: Object },
    coverPages: { type: Object },
    dynamicPricing: { type: Boolean },
    cost: { type: Number },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;