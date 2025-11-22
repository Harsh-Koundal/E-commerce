import mongoose from "mongoose";
import Category from "./models/Category.js";
import AccessoryCategory from './models/AccessoryCategory.js';
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Error:", err));

const categories = [
    {
        id: "document-printing",
        name: "Document Printing",
        description: "High-quality printing for documents, books, visiting cards, certificates, letterheads, and posters.",
        paperSize: "A4, A3, Custom Sizes",
        image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/docPrintjpg_i2y7cx.jpg",

        subcategories: [
            {
                id: "document-printing",
                name: "Document Printing",
                description: "Professional documents printing for business and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165532/FA_DOCUMENT_PRINTING75_to3w4v.jpg"
            },
            {
                id: "letterhead-printing",
                name: "Letterhead Printing",
                description: "Professional letterhead printing for business and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/online-letterhead_bghab0.jpg"
            },
            {
                id: "certificates-printing",
                name: "Certificates Printing",
                description: "High-quality certificate printing for academic and corporate needs.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/Certificate_w6mmgv.jpg"
            },
            {
                id: "poster-printing",
                name: "Poster Printing",
                description: "Vibrant and detailed poster printing for marketing and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/poster_fkshnm.jpg"
            },
            {
                id: "visiting-card-printing",
                name: "Visiting Card Printing",
                description: "Vibrant and detailed poster printing for marketing and personal use.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1740146868/printEcom/visitingCard_vjs3bv.jpg"
            },
            {
                id: "leaflet-flyers-pamphlet-printing",
                name: "Leaflet/Flyers/Pamphlet Printing",
                description: "Compact and engaging prints for business promotions and events.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165629/Travel-Trifold-Brochure_pfmxjk.jpg"
            },
            {
                id: "notebook-printing",
                name: "Notebook Printing",
                description: "Custom notebooks for students, offices, and personal journaling.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165738/Customize-Notebook-Printing-b_e1rcjk.jpg"
            },
            {
                id: "brochure-printing",
                name: "Brochure Printing",
                description: "Informative and professional brochures for marketing and corporate needs.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165814/brochure-copy_mpgzol.jpg"
            },
            {
                id: "photo-album-printing",
                name: "Photo Album Printing",
                description: "Premium-quality printed albums for cherished memories.",
                image:"https://res.cloudinary.com/di3caz3zz/image/upload/v1743165867/family-photo-album-spring-weekend_vhiais.webp"
            },
        ],

        colorType: {
            "Black & White": "Standard monochrome printing",
            "Color": "Vivid full-color printing",
        },
        
        costPerCopy: {  //  Use subcategory IDs as keys
            "document-printing": {
                "75GSM - Normal Paper": { singleSide: 0.99, backToBack: 0.89 },
                "100GSM - Duo Paper": { singleSide: 2.5, backToBack: 2 },
            },
            "letterhead-printing": {
                "75GSM - Normal Paper": { singleSide: 0.99, backToBack: 0.89 },
                "100GSM - Duo Paper": { singleSide: 2.5, backToBack: 2 },
            },
            "certificates-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "visiting-card-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "poster-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "leaflet-flyers-pamphlet-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
            "notebook-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
             "brochure-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
             "photo-album-printing": {
                "75GSM - Normal Paper": { singleSide: 5.75, backToBack: 5.25 },
                "100GSM - Duo Paper": { singleSide: 7, backToBack: 7 },
            },
        },

        paperTypes: {
            "Normal": "75 GSM",
            "Duo": "100 GSM",
            "Glossy": "120 GSM",
            "Matte": "150 GSM",
        },

        printQualities: {
            "Standard": "Regular print quality",
            "High": "High-resolution print with rich colors",
        },

        printedSides: {
            "Single Side": "Printed on one side only",
            "Back to Back": "Printed on both sides",
        },

        bindingOptions: {
            "Spiral Binding": "Plastic or metal spiral binding",
            "Hard Binding": "Durable hardbound cover",
            "Soft Binding": "Flexible cover binding",
        },

        laminationOptions: {
            "Glossy": "Shiny, reflective lamination",
            "Matte": "Soft, non-reflective finish",
        },

        pageOrientations: {
            "Portrait": "Standard vertical format",
            "Landscape": "Wider horizontal format",
        },

        coverPages: {
            "None": "No additional cover page",
            "Transparent": "Clear plastic cover",
            "Cardstock": "Harder paper cover for durability",
        },
    },
    {
        id: "3d-printing",
        name: "3D Printing",
        image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808007/printEcom/3d-pront_fdknyg.webp",
        description: "Upload your 3D design and get it printed with precision.",
        dynamicPricing: true,
    },
    {
        id: "3d-infra-design",
        name: "3D Infra Design",
        image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808006/printEcom/3d-infra_q6rbjn.webp",
        description: "Request a professional 3D infrastructure design tailored to your needs.",
        dynamicPricing: true,
    },
];

const accessoryCategories = [
    {
        id: 'accessory-printing',
        name: 'Accessory Printing',
        image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1742808006/printEcom/accesory-print_peuj1p.jpg',
        description: 'Transform everyday items into unique expressions of your personality or brand. Our accessory printing services cover everything from custom t-shirts and caps to personalized mugs and bags. Perfect for gifts, promotional items, or personal use.',
        cost: 599,
        subcategories: [
            {
                id: 'custom-polo-t-shirts',
                name: 'Custom Polo T-shirts',
                description: 'Personalized polo shirts with your designs.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603308/custom-black_gupvgl.webp',
                material: 'Cotton',
                sizeOptions: ['S', 'M', 'L', 'XL'],
                colorOptions: ['Red', 'Blue', 'White'],
                customizationOptions: 'Logo placement, text input',
                baseCost: 20,
                customizationCosts: { logo: 5, text: 3 },
                availableSizes: ['S', 'M', 'L'],
                availableColors: ['Red', 'Blue'],
            },
            {
                id: 'office-shirts',
                name: 'Office Shirts',
                description: 'Professional custom office shirts.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603392/Whiet-Shirt-Front-500x500_i9xvpk.jpg',
                material: 'Cotton blend',
                sizeOptions: ['S', 'M', 'L', 'XL'],
                colorOptions: ['White', 'Light Blue'],
                customizationOptions: 'Logo embroidery',
                baseCost: 25,
                customizationCosts: { embroidery: 8 },
                availableSizes: ['M', 'L', 'XL'],
                availableColors: ['White'],
            },
            {
                id: 'custom-t-shirts',
                name: 'Custom T-shirts',
                description: 'Design your own custom t-shirts.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603454/black-1_g9vbyk.jpg',
                material: 'Cotton',
                sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
                colorOptions: ['Black', 'White', 'Gray', 'Navy'],
                customizationOptions: 'Full print, front print, back print',
                baseCost: 18,
                customizationCosts: { full: 10, front: 5, back: 5 },
                availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
                availableColors: ['Black', 'White', 'Gray'],
            },
            {
                id: 'custom-stamps-ink',
                name: 'Custom Stamps & Ink',
                description: 'Personalized stamps and ink pads.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603537/stamp_wfvbk7.jpg',
                material: 'Plastic, Rubber',
                customizationOptions: 'Text input, logo upload',
                baseCost: 15,
                customizationCosts: { logo: 7 },
            },
            {
                id: 'photo-gifts',
                name: 'Photo Gifts',
                description: 'Personalized photo gifts for any occasion.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603668/customised-gift-items_oalcph.jpg',
                material: 'Various',
                customizationOptions: 'Photo upload, text input',
                baseCost: 22,
                customizationCosts: { photo: 6, text: 3 },
            },
            {
                id: 'custom-caps',
                name: 'Custom Caps',
                description: 'Customized caps with your logo or design.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603737/caps_uu4nwx.webp',
                material: 'Cotton, Polyester',
                colorOptions: ['Black', 'White', 'Red', 'Blue'],
                customizationOptions: 'Embroidery, print',
                baseCost: 17,
                customizationCosts: { embroidery: 8, print: 5 },
                availableColors: ['Black', 'White', 'Red'],
            },
            {
                id: 'custom-drinkware',
                name: 'Custom Drinkware',
                description: 'Personalized mugs, bottles, and more.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603815/drinkware_fuk6vk.avif',
                material: 'Ceramic, Stainless Steel',
                customizationOptions: 'Photo upload, text input',
                baseCost: 19,
                customizationCosts: { photo: 6, text: 3 },
            },
            {
                id: 'custom-bags',
                name: 'Custom Bags',
                description: 'Custom bags for any purpose.',
                image: 'https://res.cloudinary.com/di3caz3zz/image/upload/v1743603925/custom-printed-office-bags-for-mens-online-500x500_q48mbi.jpg',
                material: 'Canvas, Cotton, Polyester',
                sizeOptions: ['Small', 'Medium', 'Large'],
                colorOptions: ['Natural', 'Black', 'Navy'],
                customizationOptions: 'Print, embroidery',
                baseCost: 21,
                customizationCosts: { print: 5, embroidery: 7 },
                availableSizes: ['Small', 'Medium'],
                availableColors: ['Natural', 'Black'],
            },
            
        ],
    },
];
const clothingCategories = [
  {
    id: "clothing-printing",
    name: "Clothing Printing",
    image:
      "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812460/clothing-head_kjnvop.png",
    description:
      "Transform everyday items into unique expressions of your personality or brand. From custom t-shirts to premium caps and bags—perfect for events, branding, gifting, and personal use.",
    cost: 599,

    subcategories: [
      {
        id: "polo-tshirt-printing",
        name: "Polo T-shirts",
        description:
          "Smart and comfortable polo T-shirts with custom printing.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812519/polo-t-shirt_xxbtzd.png",
        material: "Cotton",
        sizeOptions: ["S", "M", "L", "XL"],
        colorOptions: ["Red", "Blue", "White"],
        customizationOptions: "Logo placement, text input",
        baseCost: 350,
        customizationCosts: { logo: 50, text: 20 },
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: ["Red", "Blue", "White"],
      },

      {
        id: "casual-tshirt-printing",
        name: "Casual T-shirts",
        description: "Everyday casual T-shirts with custom prints.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812456/casual-t-shirt_shkycv.png",
        material: "Cotton",
        sizeOptions: ["S", "M", "L", "XL", "XXL"],
        colorOptions: ["Black", "White", "Gray", "Navy"],
        customizationOptions: "Full print, front print, back print",
        baseCost: 250,
        customizationCosts: { full: 60, front: 30, back: 30 },
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        availableColors: ["Black", "White", "Gray", "Navy"],
      },

      {
        id: "anime-tshirt-printing",
        name: "Anime Printed T-shirts",
        description: "Trending anime design T-shirts.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812451/anime-t-shirt_griefc.png",
        material: "Cotton",
        sizeOptions: ["S", "M", "L", "XL"],
        colorOptions: ["Black", "White"],
        customizationOptions: "Front print, back print",
        baseCost: 450,
        customizationCosts: { front: 0, back: 0 },
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: ["Black", "White"],
      },

      {
        id: "custom-cap-printing",
        name: "Custom Printed Caps",
        description:
          "Stylish caps with embroidered or printed designs.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812454/cap_fqjggb.png",
        material: "Cotton, Polyester",
        sizeOptions: ["Free Size"],
        colorOptions: ["Black", "White", "Red", "Blue"],
        customizationOptions: "Embroidery, print",
        baseCost: 200,
        customizationCosts: { embroidery: 50, print: 30 },
        availableSizes: ["Free Size"],
        availableColors: ["Black", "White", "Red", "Blue"],
      },

      {
        id: "backpack-printing",
        name: "Backpacks",
        description: "Durable backpacks with custom branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812447/backpacks_mwevq2.png",
        material: "Canvas, Polyester",
        sizeOptions: ["Small", "Large"],
        colorOptions: ["Black", "Gray", "Navy"],
        customizationOptions: "Print, embroidery",
        baseCost: 600,
        customizationCosts: { print: 80, embroidery: 120 },
        availableSizes: ["Small", "Large"],
        availableColors: ["Black", "Gray", "Navy"],
      },

      {
        id: "cotton-bag-printing",
        name: "Cotton/Tote Bags",
        description:
          "Eco-friendly cotton tote bags for branding or gifting.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812451/bags_xnxrsl.png",
        material: "Cotton",
        sizeOptions: ["Small", "Medium", "Large"],
        colorOptions: ["Natural", "Black", "Navy"],
        customizationOptions: "Print, embroidery",
        baseCost: 100,
        customizationCosts: { print: 30, embroidery: 50 },
        availableSizes: ["Small", "Medium", "Large"],
        availableColors: ["Natural", "Black", "Navy"],
      },
    ],
  },
];



const seedDB = async () => {
    try {
        await Category.deleteMany({});
        console.log("Existing categories deleted.");

        await AccessoryCategory.deleteMany({});
        console.log('Existing accessory categories deleted.');

        await Category.insertMany(categories);
        console.log("Database Seeded Successfully!");

        await AccessoryCategory.insertMany(accessoryCategories);
        console.log('Accessory categories seeded successfully!');

        await AccessoryCategory.insertMany(clothingCategories);
        console.log('Clothing categories seeded successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
    }
};

seedDB();