// Updated categories.js with price adjustments for all files
const categories = [
  {
    id: "document-printing",
    name: "Document Printing",
    image: "/images/docPrintjpg.jpg",
    description: "High-quality printing for documents, books, visiting cards, certificates, letterheads, and posters.",
    paperSize: "A4, A3, Custom Sizes",
    costPerCopy: {
      "document": 5,
      "visiting-card": 2,
      "book": 15,
      "letterhead": 8,
      "certificate": 10,
      "poster": 20,
    },
  },
  {
    id: "accessory-printing",
    name: "Accessory Printing",
    image: "/images/accesory-print.jpg",
    description: "Custom-printed T-shirts, coffee mugs, and personalized gifts.",
    tShirtSizes: ["S", "M", "L", "XL", "XXL"],
    cost: 599,
  },
  {
    id: "3d-printing",
    name: "3D Printing",
    image: "/images/3d-print.webp",
    description: "Upload your 3D design and get it printed with precision.",
    costPerCopy: "Based on complexity",
  },
  {
    id: "3d-infra-design",
    name: "3D Infra Design",
    image: "/images/3d-infra.webp",
    description: "Request a professional 3D infrastructure design tailored to your needs.",
    costPerCopy: "Based on project scope",
  },
];

export default categories;
