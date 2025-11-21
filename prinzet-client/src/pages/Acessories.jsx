import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; 

// Images
import headerImage from "../assets/images/mugs-head.png";
import mugs from "../assets/images/mug.png";
import album from "../assets/images/album.png";
import giftWrap from "../assets/images/gift-wrap.png";

import {
  stationeryImg,
  stampsImg,
  postersImg,
  labelsImg,
  contactCards
} from "@/assets/index.js";

const categories = [
  { 
    title: "Mugs", 
    img: mugs, 
    description: "Personalized mugs with names, quotes, or logos — perfect for gifts or branding." 
  },
  { 
    title: "Photo Albums", 
    img: album, 
    description: "Custom photo albums to preserve your memories with stylish, durable finishes." 
  },
  { 
    title: "Gift Wraps", 
    img: giftWrap, 
    description: "Beautiful custom gift wraps that make every present extra special." 
  },
];

const categorySlugMap = {
  Mugs: "mugs-printing",
  "Photo Albums": "albums-printing",
  "Gift Wraps": "gift-wraps-printing",
};

const priceData = {
  // Mugs
  "mugs-printing": {
    "Classic Mug": {
      color: { singleSide: 200, backToBack: 250 },
    },
    "Magic Mug": {
      color: { singleSide: 300, backToBack: 350 },
    },
    "Travel Mug": {
      color: { singleSide: 400, backToBack: 450 },
    },
  },

  // Albums
  "albums-printing": {
    "Mini Photo Album (20 pages)": {
      color: { singleSide: 500, backToBack: null },
    },
    "Standard Album (40 pages)": {
      color: { singleSide: 900, backToBack: null },
    },
    "Premium Album (60 pages)": {
      color: { singleSide: 1400, backToBack: null },
    },
  },

  // Gift Wraps
  "gift-wraps-printing": {
    "Custom Wrapping Sheet (per sheet)": {
      color: { singleSide: 50, backToBack: null },
    },
    "Premium Glossy Wrap": {
      color: { singleSide: 100, backToBack: null },
    },
    "Eco-friendly Kraft Wrap": {
      color: { singleSide: 80, backToBack: null },
    },
  },
};

const exploreCategories = [
  { name: "Contact Cards", img: contactCards, redirect: "/contact-cards" },
  { name: "Stationery, Letterheads & Notebooks", img: stationeryImg, redirect: "/stationery" },
  { name: "Stamps & Inks", img: stampsImg, redirect: "/stamp-inks" },
  { name: "Posters & Signs", img: postersImg, redirect: "/posters" },
  { name: "Labels, Stickers & Packaging", img: labelsImg, redirect: "/packaging" },
];

export default function MugsAlbumGift() { 
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
            alt="Mugs, Albums & Gifts"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Mugs, Albums & Gifts</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>The kind of gifts that stay.</b> <br />
              Turn everyday items into something memorable. Whether it’s personal or professional, custom gifts go a long way.
            </p>
            <ul className="list-disc ml-5 mt-2">
              <li>Personalized mugs, photo albums, and keepsakes</li>
              <li>Add names, photos, quotes, or brand logos</li>
              <li>Perfect for birthdays, anniversaries, return gifts, or corporate giveaways</li>
              <li>High-quality finishes that last</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Mugs, Albums & Gifts</span> Subcategories
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

      {/* Explore More */}
      <div className="text-center mt-10 mb-5 bg-white py-4 rounded-lg shadow-md p-0">
        <div className="flex justify-start items-center mb-4 bg-[#FDF1F2] w-fit p-4 rounded-r-full">
          <h2 className="text-2xl font-bold">Explore More Services :</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-6 py-6">
          {exploreCategories.slice(0, 5).map((cat) => (
            <Link key={cat.name} to={cat.redirect}>
              <div className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-20 h-20 object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-900">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Modal */}
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
                      <th className="py-2 px-2 border-b text-left">Product</th>
                      <th className="py-2 px-2 border-b text-left">Print Type</th>
                      <th className="py-2 px-2 border-b text-left">Single Side</th>
                      <th className="py-2 px-2 border-b text-left">Back to Back</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedPrices).map(([product, details]) =>
                      Object.entries(details).map(([printType, options]) => (
                        <tr key={`${product}-${printType}`}>
                          <td className="py-2 px-2 border-b">{product}</td>
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
