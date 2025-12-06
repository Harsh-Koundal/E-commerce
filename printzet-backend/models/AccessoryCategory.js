import mongoose from 'mongoose';

const accessoryCategorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    subcategories: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        material: { type: String },
        sizeOptions: [{ type: String }],
        colorOptions: [{ type: String }],
        customizationOptions: { type: String },
        baseCost: { type: Number },
        customizationCosts: { type: Object },
        availableSizes: [{type: String}],
        availableColors: [{type: String}]
    }],
    dynamicPricing: { type: Boolean },
    cost: { type: Number },
});

const AccessoryCategory = mongoose.model('AccessoryCategory', accessoryCategorySchema);
export default AccessoryCategory;