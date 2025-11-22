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

const stationeryCategories = [
  {
    id: "stationery-printing",
    name: "Stationery, Letterheads & Notebooks",
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1744809000/stationery-header.png",
    description:
      "Premium stationery printing including notebooks, letterheads, brochures, ID cards, and corporate stamps.",

    subcategories: [
      {
        id: "notebook-printing",
        name: "Notebook",
        description:
          "Custom notebooks with branded covers – perfect for office, events, or giveaways.",
        image: "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812510/notebooks-image_u3jrex.png",
        material: "Paper / Hard Cover",
        sizeOptions: ["A5", "A4"],
        colorOptions: ["Multi-color"],
        customizationOptions: "Cover print, inside pages",
        baseCost: 120,
        customizationCosts: { full: 60 },
        availableSizes: ["A5", "A4"],
        availableColors: ["White"],
      },

      {
        id: "letterhead-printing",
        name: "Letterhead",
        description:
          "Professional letterheads that reflect your brand identity on every page.",
        image: "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812477/letterheads-image_yk0903.png",
        material: "100gsm / 120gsm",
        sizeOptions: ["A4"],
        colorOptions: ["White"],
        customizationOptions: "Logo, address, brand layout",
        baseCost: 250,
        customizationCosts: { premium: 100 },
        availableSizes: ["A4"],
        availableColors: ["White"],
      },

      {
        id: "brochure-printing",
        name: "Brochures & Booklets",
        description:
          "High-quality brochures and booklets to showcase your business and services.",
        image: "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812452/brochures-image_kt3k0c.png",
        material: "Glossy / Matte",
        sizeOptions: ["Tri-Fold", "Bi-Fold"],
        colorOptions: ["Full Color"],
        customizationOptions: "Fold type, design layout",
        baseCost: 450,
        customizationCosts: { triFold: 50, biFold: 30 },
        availableSizes: ["Tri-Fold", "Bi-Fold"],
        availableColors: ["Full Color"],
      },

      {
        id: "seal-stamp-printing",
        name: "Corporate Seal Stamps",
        description:
          "Custom corporate seals for official documentation and business use.",
        image: "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812536/seal-stamp_mts1of.png",
        material: "Rubber / Plastic / Metal",
        sizeOptions: ["Standard"],
        colorOptions: ["Black", "Blue"],
        customizationOptions: "Embossing, text input, logo",
        baseCost: 600,
        customizationCosts: { emboss: 150 },
        availableSizes: ["Standard"],
        availableColors: ["Black", "Blue"],
      },

      {
        id: "id-card-printing",
        name: "ID Cards",
        description:
          "Durable, professional ID cards for employees, students, or events.",
        image: "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812470/id-cards_nroxmc.png",
        material: "PVC / Smart Chip",
        sizeOptions: ["Standard"],
        colorOptions: ["Multi-color"],
        customizationOptions: "Photo, company logo, barcode, chip",
        baseCost: 80,
        customizationCosts: { chip: 200 },
        availableSizes: ["Standard"],
        availableColors: ["Multi-color"],
      },
    ],
  },
];

const stampInkCategories = [
  {
    id: "stamp-ink-printing",
    name: "Stamps & Inks",
    image: "https://res.cloudinary.com/di3caz3zz/image/upload/v1744809200/stamp-ink-header.png",
    description:
      "Customized signature stamps, rubber stamps, date stamps, corporate seals, and premium inks—all built for clear and long-lasting impressions.",

    subcategories: [
      {
        id: "signature-stamp-printing",
        name: "Signature Stamp",
        description:
          "Custom signature stamps for fast approvals and everyday office documentation.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812527/signature-stamp_epllcz.png",
        material: "Pre-Inked / Self-Inking",
        sizeOptions: ["Small", "Medium"],
        colorOptions: ["Black", "Blue"],
        customizationOptions: "Signature upload, name, text",
        baseCost: 250,
        customizationCosts: { preInked: 50 },
        availableSizes: ["Small", "Medium"],
        availableColors: ["Black", "Blue"],
      },

      {
        id: "rubber-stamp-printing",
        name: "Rubber Stamp",
        description:
          "Durable rubber stamps suitable for business and official use.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812534/rubber-stamp_r4nvyo.png",
        material: "Rubber + Wooden/Plastic Handle",
        sizeOptions: ["Small", "Medium", "Large"],
        colorOptions: ["Black", "Blue"],
        customizationOptions: "Text, logo, formatting",
        baseCost: 200,
        customizationCosts: { heavyDuty: 150 },
        availableSizes: ["Small", "Medium", "Large"],
        availableColors: ["Black", "Blue"],
      },

      {
        id: "date-stamp-printing",
        name: "Date Stamp",
        description:
          "Rotating date stamps designed for record keeping and office tasks.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812462/date-stamp_mwdyyn.png",
        material: "Plastic / Metal",
        sizeOptions: ["Standard"],
        colorOptions: ["Black", "Blue"],
        customizationOptions: "Self-inking or manual option",
        baseCost: 280,
        customizationCosts: { selfInking: 120 },
        availableSizes: ["Standard"],
        availableColors: ["Black", "Blue"],
      },

      {
        id: "seal-stamp-printing",
        name: "Corporate Seal Stamps",
        description:
          "Professional embossing and seal stamps for businesses and legal documentation.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812536/seal-stamp_mts1of.png",
        material: "Metal / Heavy Duty",
        sizeOptions: ["Standard"],
        colorOptions: ["Black"],
        customizationOptions: "Embossing logo, company name, registration number",
        baseCost: 600,
        customizationCosts: { embossing: 150 },
        availableSizes: ["Standard"],
        availableColors: ["Black"],
      },

      {
        id: "inks-printing",
        name: "Inks",
        description:
          "Premium-quality refill inks for stamps, available in multiple colors.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812469/inks_mpgatr.png",
        material: "Oil-Based Ink",
        sizeOptions: ["30ml", "60ml"],
        colorOptions: ["Black", "Blue", "Red", "Green"],
        customizationOptions: "Bottle size, color selection",
        baseCost: 100,
        customizationCosts: { color: 50 },
        availableSizes: ["30ml", "60ml"],
        availableColors: ["Black", "Blue", "Red", "Green"],
      },
    ],
  },
];

const posterSignsCategories = [
  {
    id: "poster-signs-printing",
    name: "Posters, Signs & Mousepads",
    image:
      "https://res.cloudinary.com/di3caz3zz/image/upload/v1744890001/poster-head.png",
    description:
      "High-quality flyers, banners, standees, posters, outdoor signs, and mousepads for branding, décor, events, and marketing.",

    subcategories: [
      {
        id: "flyers-printing",
        name: "Flyers",
        description:
          "Vibrant, high-quality flyers for promotions, events, and bulk printing.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812468/flayer_uiowwp.png",
        material: "130–170 GSM Glossy / Premium Paper",
        sizeOptions: ["A5", "A4"],
        colorOptions: ["Full Color"],
        customizationOptions: "Single/Double Side Print",
        baseCost: 3,
        customizationCosts: {
          "A5-130gsm-single": 3,
          "A5-130gsm-double": 5,
          "A4-130gsm-single": 5,
          "A4-170gsm-single": 7,
        },
      },
      {
        id: "standees-printing",
        name: "Standees",
        description:
          "Portable roll-up standees perfect for events, exhibitions, and branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812551/standees_xp7myj.png",
        material: "Flex / Vinyl",
        sizeOptions: ["6x3 ft", "6x2 ft"],
        colorOptions: ["Full Color"],
        customizationOptions: "Single Side Print",
        baseCost: 400,
        customizationCosts: {
          "6x3-rollup": 500,
          "6x2-rollup": 400,
          "6x3-flex": 350,
        },
      },
      {
        id: "posters-printing",
        name: "Posters",
        description:
          "Premium posters for advertising, décor, events, and indoor branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812525/poster-card_hln1ny.png",
        material: "130–200 GSM Gloss Paper",
        sizeOptions: ["A3", "A2", "A1"],
        colorOptions: ["Full Color"],
        customizationOptions: "Indoor Gloss Finish",
        baseCost: 20,
        customizationCosts: {
          "A3-gloss": 20,
          "A2-gloss": 40,
          "A1-gloss": 80,
        },
      },
      {
        id: "banners-printing",
        name: "Banners",
        description:
          "Durable banners for outdoor advertising, promotions, and events.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812451/banner_nlu0dd.png",
        material: "Flex / Vinyl",
        sizeOptions: ["6x3 ft", "8x4 ft"],
        colorOptions: ["Full Color"],
        customizationOptions: "Weather Resistant Print",
        baseCost: 120,
        customizationCosts: {
          "6x3-flex": 120,
          "8x4-flex": 180,
          "6x3-vinyl": 200,
        },
      },
      {
        id: "outdoor-signs-printing",
        name: "Outdoor Signs",
        description:
          "Premium sunboard and acrylic signs for shops, offices, and branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812518/outdoor-signs_t4jyeq.png",
        material: "Sunboard 3–5mm / Acrylic",
        sizeOptions: ["2x2 ft", "3x2 ft", "2x1 ft"],
        colorOptions: ["Full Color"],
        customizationOptions: "UV Print / Gloss Finish",
        baseCost: 300,
        customizationCosts: {
          "2x2-sunboard-3mm": 300,
          "3x2-sunboard-5mm": 500,
          "2x1-acrylic": 800,
        },
      },
      {
        id: "mousepads-printing",
        name: "MousePads",
        description:
          "High-quality custom mousepads for gaming, office use, and gifting.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812478/mousepad_zgltfa.png",
        material: "Rubber Base + Fabric Top",
        sizeOptions: ["7x9 in", "10x12 in", "12x18 in"],
        colorOptions: ["Full Color"],
        customizationOptions: "Edge-to-edge Print",
        baseCost: 150,
        customizationCosts: {
          "standard-7x9": 150,
          "large-10x12": 250,
          "gaming-12x18": 400,
        },
      },
    ],
  },
];

const labelStickerPackagingCategories = [
  {
    id: "label-sticker-packaging",
    name: "Labels, Stickers & Packaging",
    image:
      "https://res.cloudinary.com/di3caz3zz/image/upload/v1744895001/packaging.png",
    description:
      "Custom labels, stickers, and packaging designed for branding, product packaging, gifting, and marketing.",

    subcategories: [
      // -------------------- LABELS --------------------
      {
        id: "labels-printing",
        name: "Labels",
        description:
          "Custom paper, vinyl, and transparent labels for branding and packaging.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812471/labels-card_iuqp5v.png",
        material: "Paper, Vinyl, Transparent",
        sizeOptions: ["A4 Sheet", "Custom Cut"],
        colorOptions: ["Full Color"],
        customizationOptions: "Gloss/Matte Finish, Waterproof",
        baseCost: 10,
        customizationCosts: {
          "paper-a4-single": 10,
          "vinyl-waterproof": 15,
          "transparent-label": 20,
        },
        availableSizes: ["A4 Sheet"],
        availableColors: ["Full Color"],
      },

      // -------------------- PACKAGING --------------------
      {
        id: "packaging-printing",
        name: "Packaging",
        description:
          "Durable custom boxes and wraps designed to protect and promote products.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812504/packaging-card_kq3fb0.png",
        material: "Cardboard / Kraft / Premium Board",
        sizeOptions: ["Small", "Medium", "Large"],
        colorOptions: ["Full Color"],
        customizationOptions: "Logo Print, Box Shape, Die Cut",
        baseCost: 50,
        customizationCosts: {
          "box-small": 50,
          "box-medium": 80,
          "box-large": 120,
        },
        availableSizes: ["Small", "Medium", "Large"],
        availableColors: ["Full Color"],
      },

      // -------------------- STICKERS --------------------
      {
        id: "stickers-printing",
        name: "Stickers",
        description:
          "High-quality die-cut and vinyl stickers for marketing, branding, and personal use.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812557/stickers_miqrb7.png",
        material: "Vinyl, Matte, Gloss, Waterproof",
        sizeOptions: ["Per Sq Inch", "A4 Sheet"],
        colorOptions: ["Full Color"],
        customizationOptions: "Die-Cut, Kiss-Cut, Glossy/Matte Finish",
        baseCost: 5,
        customizationCosts: {
          "diecut-sqinch": 5,
          "kisscut-sheet": 30,
          "vinyl-waterproof": 40,
        },
        availableSizes: ["Custom", "A4"],
        availableColors: ["Full Color"],
      },
    ],
  },
];

const mugsAlbumGiftCategories = [
  {
    id: "mugs-albums-gifts",
    name: "Mugs, Albums & Gifts",
    image:
      "https://res.cloudinary.com/di3caz3zz/image/upload/v1744897001/mugs-head.png",
    description:
      "Custom mugs, photo albums, and special gift wraps designed for personal gifts, branding, and memorable keepsakes.",

    subcategories: [
      // -------------------- MUGS --------------------
      {
        id: "mugs-printing",
        name: "Mugs",
        description:
          "Personalized mugs with names, quotes, photos, or brand logos.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812479/mug_itbi7n.png",
        material: "Ceramic / Magic Color-Changing / Steel",
        sizeOptions: ["325ml", "350ml", "Travel Mug Size"],
        colorOptions: ["White", "Black", "Magic Black-Heat"],
        customizationOptions: "Photo, Name, Logo, Quote",
        baseCost: 200,
        customizationCosts: {
          classic_single: 200,
          classic_double: 250,
          magic_single: 300,
          magic_double: 350,
          travel_single: 400,
          travel_double: 450,
        },
        availableSizes: ["325ml", "350ml"],
        availableColors: ["White", "Black"],
      },

      // -------------------- PHOTO ALBUMS --------------------
      {
        id: "albums-printing",
        name: "Photo Albums",
        description:
          "Custom photo albums with premium covers and high-quality paper.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812450/album_yfrelw.png",
        material: "Premium Gloss / Matte / Velvet",
        sizeOptions: ["Mini", "Standard", "Premium"],
        colorOptions: ["Full Color"],
        customizationOptions: "Photo Upload, Name, Cover Design",
        baseCost: 500,
        customizationCosts: {
          mini: 500,
          standard: 900,
          premium: 1400,
        },
        availableSizes: ["Mini", "Standard", "Premium"],
        availableColors: ["Full Color"],
      },

      // -------------------- GIFT WRAPS --------------------
      {
        id: "gift-wraps-printing",
        name: "Gift Wraps",
        description:
          "Custom printed wrapping papers ideal for gifting and branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812468/gift-wrap_kmw3k5.png",
        material: "Gloss, Matte, Kraft",
        sizeOptions: ["Per Sheet"],
        colorOptions: ["Full Color"],
        customizationOptions: "Design Print, Logo, Pattern",
        baseCost: 50,
        customizationCosts: {
          sheet_custom: 50,
          glossy: 100,
          kraft: 80,
        },
        availableSizes: ["Sheet"],
        availableColors: ["Full Color"],
      },
    ],
  },
];

const customDrinkwareCategories = [
  {
    id: "custom-drinkware",
    name: "Custom Drinkware",
    image:
      "https://res.cloudinary.com/di3caz3zz/image/upload/v1744901001/custom-drinkware.png",
    description:
      "Premium personalized drinkware including tumblers, bottles, and sippers — ideal for corporate gifting, personal use, and branding.",

    subcategories: [
      // ------------------- WATER TUMBLER -------------------
      {
        id: "water-tumbler-printing",
        name: "Water Tumbler",
        description:
          "Durable personalised water tumblers with stylish and premium prints.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812557/water-tumbler_u49ln4.png",
        material: "Steel / Plastic",
        sizeOptions: ["500ml", "750ml"],
        colorOptions: ["Black", "White", "Silver"],
        customizationOptions: "Logo, Name, Design Print",
        baseCost: 350,
        customizationCosts: {
          standard_single: 350,
          standard_backToBack: 400,
          premium_single: 500,
          premium_backToBack: 600,
        },
        availableSizes: ["500ml", "750ml"],
        availableColors: ["Black", "White"],
      },

      // ------------------- COFFEE TUMBLER -------------------
      {
        id: "coffee-tumbler-printing",
        name: "Coffee Tumbler",
        description:
          "Keep your drinks hot or cold with customized thermal tumblers.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812456/coffee-tumbler_qjdfhj.png",
        material: "Steel / Insulated",
        sizeOptions: ["350ml", "500ml"],
        colorOptions: ["Black", "Matte Black", "Silver"],
        customizationOptions: "Name, Logo, Graphic Print",
        baseCost: 400,
        customizationCosts: {
          classic_single: 400,
          classic_backToBack: 450,
          thermal_single: 600,
          thermal_backToBack: 700,
        },
        availableSizes: ["350ml"],
        availableColors: ["Black", "Silver"],
      },

      // ------------------- CUSTOM BOTTLES -------------------
      {
        id: "bottles-printing",
        name: "Custom Printed Bottles",
        description:
          "Reusable BPA-free bottles with premium custom printing options.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812461/custom-bottles_x62t95.png",
        material: "Plastic / Steel / Insulated",
        sizeOptions: ["600ml", "1L"],
        colorOptions: ["Blue", "Black", "White", "Silver"],
        customizationOptions: "Logo, Name, Full Wrap Print",
        baseCost: 200,
        customizationCosts: {
          plastic_single: 200,
          plastic_backToBack: 250,
          steel_single: 450,
          steel_backToBack: 550,
          insulated_single: 700,
          insulated_backToBack: 850,
        },
        availableSizes: ["600ml", "1L"],
        availableColors: ["Blue", "Black"],
      },

      // ------------------- SIPPERS -------------------
      {
        id: "sippers-printing",
        name: "Sippers",
        description:
          "Trendy printed sippers customized for your personal or business needs.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812531/sippers_nzy5ca.png",
        material: "Plastic / Steel",
        sizeOptions: ["500ml", "700ml"],
        colorOptions: ["Black", "Red", "White", "Silver"],
        customizationOptions: "Name, Logo, Design Print",
        baseCost: 250,
        customizationCosts: {
          standard_single: 250,
          standard_backToBack: 300,
          premium_single: 400,
          premium_backToBack: 500,
        },
        availableSizes: ["500ml"],
        availableColors: ["Black", "Red"],
      },
    ],
  },
];

const contactCardCategories = [
  {
    id: "contact-cards",
    name: "Contact Cards",
    image:
      "https://res.cloudinary.com/di3caz3zz/image/upload/v1744898001/contact-cards-head.png",
    description:
      "Professional and modern contact cards—from classic visiting cards to smart NFC cards. Build your identity with premium finishes and smart features.",

    subcategories: [
      // -------------------- Visiting Cards --------------------
      {
        id: "visiting-card-printing",
        name: "Visiting Cards",
        description:
          "Classic visiting cards designed with premium paper and clean layouts.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812554/visiting-card_mxtrmz.png",
        material: "Matte / Glossy Paper",
        sizeOptions: ["Standard 3.5 x 2 inch"],
        colorOptions: ["Full Color"],
        customizationOptions: "Logo, Name, Contact Details, QR Code",
        baseCost: 120,
        customizationCosts: {
          matte_single: 150,
          matte_double: 200,
          glossy_single: 180,
          glossy_double: 250,
        },
        availableSizes: ["Standard"],
        availableColors: ["Full Color"],
      },

      // -------------------- Business Cards --------------------
      {
        id: "business-card-printing",
        name: "Business Cards",
        description:
          "Premium business cards with luxury finishes for impactful branding.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812554/visiting-card_mxtrmz.png",
        material: "350gsm | Matte | Velvet Touch | Glossy",
        sizeOptions: ["Standard"],
        colorOptions: ["Full Color"],
        customizationOptions: "Logo, QR Code, Design Upload",
        baseCost: 120,
        customizationCosts: {
          standard_single: 120,
          standard_double: 180,
        },
        availableSizes: ["Standard"],
        availableColors: ["Full Color"],
      },

      // -------------------- Standard Cards --------------------
      {
        id: "standard-card-printing",
        name: "Standard Cards",
        description: "Clean, minimal, and modern standard contact cards.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812545/standard-card_txvooh.png",
        material: "Matte / Glossy",
        sizeOptions: ["Standard"],
        colorOptions: ["Full Color"],
        customizationOptions: "Basic Text, Logo",
        baseCost: 100,
        customizationCosts: {
          matte: { singleSide: 100, backToBack: 150 },
          glossy: { singleSide: 120, backToBack: 170 },
        },
        availableSizes: ["Standard"],
        availableColors: ["Full Color"],
      },

      // -------------------- Vertical Cards --------------------
      {
        id: "vertical-card-printing",
        name: "Vertical Cards",
        description:
          "Vertical business cards that stand out with a unique modern design.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812556/vertical-card_jskizm.png",
        material: "Matte / Glossy",
        sizeOptions: ["Vertical Size"],
        colorOptions: ["Full Color"],
        customizationOptions: "Logo, QR, Photo, Minimal Layout",
        baseCost: 160,
        customizationCosts: {
          matte_vertical: 160,
          glossy_vertical: 180,
        },
        availableSizes: ["Vertical"],
        availableColors: ["Full Color"],
      },

      // -------------------- Folded Cards --------------------
      {
        id: "folded-card-printing",
        name: "Folded Cards",
        description:
          "Folded cards offering extra space for branding, messages, or creative layouts.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812466/folded-card_xk4md2.png",
        material: "Matte / Glossy",
        sizeOptions: ["Folded Size"],
        colorOptions: ["Full Color"],
        customizationOptions: "Inside + Outside Print, Logo, QR Code",
        baseCost: 200,
        customizationCosts: {
          matte_folded: 200,
          glossy_folded: 250,
        },
        availableSizes: ["Folded"],
        availableColors: ["Full Color"],
      },

      // -------------------- NFC Cards --------------------
      {
        id: "nfc-card-printing",
        name: "NFC Cards",
        description:
          "Smart tap-to-share NFC cards for digital contact sharing, websites, portfolios, and more.",
        image:
          "https://res.cloudinary.com/du6lwwaqq/image/upload/v1763812495/nfc-card_vgqkbq.png",
        material: "PVC / Metal NFC",
        sizeOptions: ["Standard"],
        colorOptions: ["Black", "White", "Color Print"],
        customizationOptions: "NFC Chip, Logo, QR, Digital Profile",
        baseCost: 500,
        customizationCosts: {
          standard_nfc: 500,
          premium_nfc: 800,
        },
        availableSizes: ["Standard"],
        availableColors: ["Black", "White"],
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

        await AccessoryCategory.insertMany(stationeryCategories);
        console.log('stationery categories seeded successfully!');

        await AccessoryCategory.insertMany(stampInkCategories);
        console.log('stamps categories seeded successfully!');

        await AccessoryCategory.insertMany(posterSignsCategories);
        console.log('posters categories seeded successfully!');

        await AccessoryCategory.insertMany(labelStickerPackagingCategories);
        console.log('labels categories seeded successfully!');

        await AccessoryCategory.insertMany(mugsAlbumGiftCategories);
        console.log('mugs categories seeded successfully!');

        await AccessoryCategory.insertMany(customDrinkwareCategories);
        console.log('drinkwares categories seeded successfully!');

        await AccessoryCategory.insertMany(contactCardCategories);
        console.log('contact categories seeded successfully!');
        
        await AccessoryCategory.insertMany(clothingCategories);
        console.log('Clothing categories seeded successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
    }
};

seedDB();