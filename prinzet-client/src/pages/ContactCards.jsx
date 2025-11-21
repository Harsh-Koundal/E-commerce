import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; 

// Images
import visitingCard from "../assets/images/visiting-card.png";
import headerImage from "../assets/images/contacts-card.png";
import standardCard from "../assets/images/standard-card.png";
import verticalCard from "../assets/images/vertical-card.png";
import foldedCard from "../assets/images/folded-card.png";
import nfcCard from "../assets/images/nfc-card.png";
import businessCardsImage from "../assets/images/business-card.png";

const categories = [
  { 
    title: "Visiting Cards", 
    img: visitingCard,
    description: "Classic visiting cards to share your contact details with style and professionalism."
  },
  { 
    title: "Business Cards", 
    img: businessCardsImage,
    description: "Premium business cards designed to build strong first impressions and brand identity."
  },
  { 
    title: "Standard Cards", 
    img: standardCard,
    description: "Simple yet elegant standard cards for everyday professional use."
  },
  { 
    title: "Vertical Cards", 
    img: verticalCard,
    description: "Unique vertical cards that stand out and give a modern look to your profile."
  },
  { 
    title: "Folded Cards", 
    img: foldedCard,
    description: "Folded cards with extra space for creativity, details, or special messages."
  },
  { 
    title: "NFC Cards", 
    img: nfcCard,
    description: "Smart NFC cards that allow instant sharing of your details with just a tap."
  },
];


const categorySlugMap = {
  "Visiting Cards": "visiting-card-printing",
  "Business Cards": "business-card-printing",
  "Standard Cards": "standard-card-printing",
  "Vertical Cards": "vertical-card-printing",
  "Folded Cards": "folded-card-printing",
  "NFC Cards": "nfc-card-printing",
};


const priceData = {
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
  "business-card-printing": {
    "Standard Paper - Single Sided": {
      color: { singleSide: 120, backToBack: null },
    },
    "Standard Paper - Double Sided": {
      color: { singleSide: 180, backToBack: null },
    },
  },
  "standard-card-printing": {
    "Classic Matte": {
      color: { singleSide: 100, backToBack: 150 },
    },
    "Classic Glossy": {
      color: { singleSide: 120, backToBack: 170 },
    },
  },
  "vertical-card-printing": {
    "Matte Vertical": {
      color: { singleSide: 160, backToBack: 220 },
    },
    "Glossy Vertical": {
      color: { singleSide: 180, backToBack: 240 },
    },
  },
  "folded-card-printing": {
    "Matte Folded": {
      color: { singleSide: 200, backToBack: null },
    },
    "Glossy Folded": {
      color: { singleSide: 250, backToBack: null },
    },
  },
  "nfc-card-printing": {
    "Standard NFC Card": {
      color: { singleSide: 500, backToBack: null },
    },
    "Premium NFC Card": {
      color: { singleSide: 800, backToBack: null },
    },
  },
};

export default function ContactCards() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedPrices, setSelectedPrices] = useState(null);

  const handleOrderNow = (title) => {
    const categoryId = categorySlugMap[title];
    if (categoryId) navigate(`/order-page/${categoryId}`);
  };

  const handleShowPrices = (title) => {
    const categoryId = categorySlugMap[title];
    if (priceData[categoryId]) setSelectedPrices(priceData[categoryId]);
  };

  const handleClosePrices = () => setSelectedPrices(null);


  return (
    <div className="bg-gray-100 p-6 h-full">

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="Contact Cards"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Contact Cards</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Make your first impression count.</b>
              <br />
              From classic paper to smart NFC cards, we create designs that
              represent you — professionally and personally.
            </p>
            <ul>
              <li>Fully customizable designs</li>
              <li>Paper, plastic, and digital formats available</li>
              <li>Matte, glossy, or luxury finishes</li>
              <li>Perfect for events, networking, and personal branding</li>
            </ul>
          </div>
        </div>
      </div>


      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Contact Cards</span>{" "}
          Subcategories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 md:gap-8 m-2">
          {categories.map((sub, idx) => (
            <div
              key={idx}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              <img
                src={sub.img}
                alt={sub.title}
                className="w-full h-80 object-cover"
              />

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {sub.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {sub.description ||
                    "Professional printing for business and personal use."}
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
                            {printType === "blackWhite"
                              ? "Black & White"
                              : "Color"}
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
