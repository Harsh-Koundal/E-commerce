import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; 

// Images
import headerImage from "../assets/images/clothing-head.png";
import poloTshirts from "../assets/images/polo-t-shirt.png";
import casualTshirts from "../assets/images/casual-t-shirt.png";
import animeTshirts from "../assets/images/anime-t-shirt.png";
import customCaps from "../assets/images/cap.png";
import backpacks from "../assets/images/backpacks.png";
import cottonBags from "../assets/images/bags.png";

// Categories
const categories = [
  { 
    title: "Polo T-shirts", 
    img: poloTshirts,
    description: "Smart and comfortable polo T-shirts, perfect for teams, events, and casual wear."
  },
  { 
    title: "Casual T-shirts", 
    img: casualTshirts,
    description: "Everyday casual T-shirts with custom prints for personal or promotional use." 
  },
  { 
    title: "Anime Printed T-shirts", 
    img: animeTshirts,
    description: "Trendy anime-inspired T-shirts for fans who want to wear their passion." 
  },
  { 
    title: "Custom Printed Caps", 
    img: customCaps,
    description: "Stylish caps with personalized prints — great for branding, sports, and giveaways." 
  },
  { 
    title: "Backpacks", 
    img: backpacks,
    description: "Durable backpacks designed for daily use, with custom branding and designs." 
  },
  { 
    title: "Cotton/Tote Bags", 
    img: cottonBags,
    description: "Eco-friendly cotton tote bags for shopping, events, or brand promotion." 
  },
];

// Slugs
const categorySlugMap = {
  "Polo T-shirts": "polo-tshirt-printing",
  "Casual T-shirts": "casual-tshirt-printing",
  "Anime Printed T-shirts": "anime-tshirt-printing",
  "Custom Printed Caps": "custom-cap-printing",
  "Backpacks": "backpack-printing",
  "Cotton/Tote Bags": "cotton-bag-printing",
};

// Price Data
const priceData = {
  "polo-tshirt-printing": {
    "Polo T-shirt - Single Color Print": {
      color: { singleSide: 350, backToBack: 500 },
    },
    "Polo T-shirt - Full Color Print": {
      color: { singleSide: 500, backToBack: 700 },
    },
  },

  "casual-tshirt-printing": {
    "Casual T-shirt - Single Color Print": {
      color: { singleSide: 250, backToBack: 400 },
    },
    "Casual T-shirt - Full Color Print": {
      color: { singleSide: 400, backToBack: 600 },
    },
  },

  "anime-tshirt-printing": {
    "Anime Print - Front Only": {
      color: { singleSide: 450, backToBack: null },
    },
    "Anime Print - Front & Back": {
      color: { singleSide: 700, backToBack: null },
    },
  },

  "custom-cap-printing": {
    "Cap - Single Logo Print": {
      color: { singleSide: 200, backToBack: null },
    },
    "Cap - Full Print": {
      color: { singleSide: 350, backToBack: null },
    },
  },

  "backpack-printing": {
    "Backpack - Small (Logo Print)": {
      color: { singleSide: 600, backToBack: null },
    },
    "Backpack - Large (Full Print)": {
      color: { singleSide: 1200, backToBack: null },
    },
  },

  "cotton-bag-printing": {
    "Cotton Bag - Single Side": {
      color: { singleSide: 100, backToBack: null },
    },
    "Cotton Bag - Double Side": {
      color: { singleSide: 180, backToBack: null },
    },
  },
};

export default function ClothingCapBag() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedPrices, setSelectedPrices] = useState(null);

  const handleOrderNow = (title) => {
    const categoryId = categorySlugMap[title];
    if (categoryId) navigate(`/order-page/${categoryId}`);
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

      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="Clothing, Caps & Bags"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Clothing, Caps & Bags</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Clothing, Caps & Bags</b> <br />
              Wear your vibe. Carry your brand. <br />From custom tees to tote bags, we help you make a visual statement — wherever you go.
            </p>
            <ul className="list-disc ml-5 mt-2">
              <li>Comfortable, high-quality fabrics</li>
              <li>Custom printing on a range of styles and sizes</li>
              <li>Great for teams, events, merch drops, and everyday use</li>
              <li>Designed for durability and impact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Clothing, Caps & Bags</span> Subcategories
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
                  {sub.description}
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

      {/* Price Popup */}
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
                      <th className="py-2 px-2 border-b text-left">Product Type</th>
                      <th className="py-2 px-2 border-b text-left">Print Type</th>
                      <th className="py-2 px-2 border-b text-left">Single Side</th>
                      <th className="py-2 px-2 border-b text-left">Back to Back</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedPrices).map(([paperType, details]) =>
                      Object.entries(details).map(([printType, options]) => (
                        <tr key={`${paperType}-${printType}`}>
                          <td className="py-2 px-2 border-b">{paperType}</td>
                          <td className="py-2 px-2 border-b">
                            {printType === "blackWhite" ? "Black & White" : "Color"}
                          </td>
                          <td className="py-2 px-2 border-b">
                            {options.singleSide ? `₹${options.singleSide}` : "-"}
                          </td>
                          <td className="py-2 px-2 border-b">
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
