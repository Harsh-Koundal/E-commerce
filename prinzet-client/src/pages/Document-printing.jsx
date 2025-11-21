import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; 

// Images
import certificateImage from "../assets/images/certificate-image.png";
import headerImage from "../assets/images/header-image.png";
import documentsImage from "../assets/images/documents-image.png";
import notebooksImage from "../assets/images/notebooks-image.png";
import brochuresImage from "../assets/images/brochures-image.png";
import businessCardsImage from "../assets/images/business-card.png";
import letterheadsImage from "../assets/images/letterheads-image.png";

const categories = [
  { 
    title: "Certificates", 
    img: certificateImage,
    description: "High-quality certificates for academic, professional, and recognition purposes."
  },
  { 
    title: "Documents", 
    img: documentsImage,
    description: "Professional document printing with clarity and precision for official use." 
  },
  { 
    title: "Notebooks", 
    img: notebooksImage,
    description: "Custom notebooks for schools, offices, and personal use with durable binding." 
  },
  { 
    title: "Brochures & Booklets", 
    img: brochuresImage,
    description: "Engaging brochures and booklets to showcase your business, events, or services." 
  },
  { 
    title: "Business Cards", 
    img: businessCardsImage,
    description: "Premium business cards designed to leave a lasting impression." 
  },
  { 
    title: "Letterheads", 
    img: letterheadsImage,
    description: "Custom letterheads to enhance your brand’s identity in every communication." 
  },
];


const categorySlugMap = {
  Certificates: "certificates-printing",
  Documents: "document-printing",
  Notebooks: "notebook-printing",
  "Brochures & Booklets": "brochure-printing",
  "Business Cards": "visiting-card-printing",
  Letterheads: "letterhead-printing",
};


const priceData = {
  "document-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 1.5, backToBack: 2.5 },
      color: { singleSide: 5, backToBack: 9 },
    },
    "100GSM - Premium Paper": {
      blackWhite: { singleSide: 2.5, backToBack: 4 },
      color: { singleSide: 7, backToBack: 12 },
    },
    "130GSM - Thick Paper": {
      blackWhite: { singleSide: 3.5, backToBack: 6 },
      color: { singleSide: 10, backToBack: 18 },
    },
  },

  "notebook-printing": {
    "Soft Cover A5": {
      blackWhite: { singleSide: 50, backToBack: null },
    },
    "Soft Cover A4": {
      blackWhite: { singleSide: 80, backToBack: null },
    },
    "Hard Cover A5": {
      blackWhite: { singleSide: 90, backToBack: null },
    },
    "Hard Cover A4": {
      blackWhite: { singleSide: 120, backToBack: null },
    },
  },

  "visiting-card-printing": {
    "Matte Finish - Single Sided": {
      color: { singleSide: 150, backToBack: null },
    },
    "Matte Finish - Double Sided": {
      color: { singleSide: 200, backToBack: null },
    },
    "Glossy Finish - Single Sided": {
      color: { singleSide: 180, backToBack: null },
    },
    "Glossy Finish - Double Sided": {
      color: { singleSide: 250, backToBack: null },
    },
  },

  "brochure-printing": {
    "A4 - Single Side": {
      color: { singleSide: 8, backToBack: null },
    },
    "A4 - Double Side": {
      color: { singleSide: 12, backToBack: null },
    },
    "A3 - Single Side": {
      color: { singleSide: 12, backToBack: null },
    },
    "A3 - Double Side": {
      color: { singleSide: 18, backToBack: null },
    },
  },

  "certificates-printing": {
    "A4 Normal": {
      color: { singleSide: 15, backToBack: null },
    },
    "A4 Premium": {
      color: { singleSide: 25, backToBack: null },
    },
    "A3 Normal": {
      color: { singleSide: 25, backToBack: null },
    },
    "A3 Premium": {
      color: { singleSide: 40, backToBack: null },
    },
  },

  "letterhead-printing": {
    "Standard": {
      color: { singleSide: 3, backToBack: null },
    },
    "Premium": {
      color: { singleSide: 6, backToBack: null },
    },
  },
};




export default function DocumentPrinting() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedPrices, setSelectedPrices] = useState(null);

  const handleOrderNow = (title) => {
    const categoryId = categorySlugMap[title];
    if (categoryId) {
      navigate(`/order-page/${categoryId}`);
    }
  };

  const handleShowPrices = (title) => {
    const categoryId = categorySlugMap[title];
    if (priceData[categoryId]) {
      setSelectedPrices(priceData[categoryId]);
    }
  };

  const handleClosePrices = () => setSelectedPrices(null);


  return (
    <div className="bg-gray-100 p-6 h-full">

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="Documents"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Documents</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Make your first impression count.</b> <br />
              Get high-quality prints for all your document needs. We provide letterhead printing for official use, certificate printing for awards and recognition, reliable document printing for everyday requirements, and customized notebooks for personal or professional use. Clear, crisp, and ready when you need them.
            </p>
          </div>
        </div>
      </div>

    
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Document </span> Subcategories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 md:gap-8 m-2">
          {categories.map((sub, idx) => (
            <div
              key={idx}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              <img src={sub.img} alt={sub.title} className="w-full h-80 object-cover" />

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{sub.title}</h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {sub.description || "Professional printing for business and personal use."}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-4 pt-0">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-full transition"
                  onClick={() => handleShowPrices(sub.title)}
                >
                  Details
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
                  onClick={() => handleOrderNow(sub.title)}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {selectedPrices && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
    <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-full sm:max-w-lg md:max-w-3xl xl:max-w-4xl">
      <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
        Price Details
      </h3>

      <ScrollArea className="h-[60vh] w-full rounded-md border"> 
        
        <div className="p-2 sm:p-4">
          <table className="min-w-full text-sm sm:text-base md:text-lg">
            <thead>
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-left">
                  Paper Type
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-left">
                  Print Type
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-left">
                  Single Side
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-left">
                  Back to Back
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(selectedPrices).map(([paperType, details]) =>
                Object.entries(details).map(([printType, options]) => (
                  <tr key={`${paperType}-${printType}`}>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                      {paperType}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                      {printType === "blackWhite" ? "Black & White" : "Color"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                      ₹{options.singleSide}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                      {options.backToBack ? `₹${options.backToBack}` : "-"}
                    </td>
                  </tr>
                ))
              )}
               
            </tbody>
          </table>
        </div>
      </ScrollArea>

      <div className="mt-4 sm:mt-6 text-center sm:text-right">
        <button
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition"
          onClick={handleClosePrices}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
