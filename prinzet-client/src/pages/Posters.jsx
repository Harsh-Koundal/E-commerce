import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; 

// Images
import headerImage from "../assets/images/poster-head.png";
import flayers from "../assets/images/flayer.png";
import standees from "../assets/images/standees.png";
import posters from "../assets/images/poster-card.png";
import banners from "../assets/images/banner.png";
import outdoorSigns from "../assets/images/outdoor-signs.png";
import mousePad from "../assets/images/mousepad.png";

const categories = [
  { title: "Flyers", img: flayers },
  { title: "Standees", img: standees },
  { title: "Posters", img: posters },
  { title: "Banners", img: banners },
  { title: "Outdoor Signs", img: outdoorSigns },
  { title: "MousePads", img: mousePad }, 
];

const categorySlugMap = {
  Flyers: "flyers-printing",
  Standees: "standees-printing",
  Posters: "posters-printing",
  Banners: "banners-printing",
  "Outdoor Signs": "outdoor-signs-printing",
  MousePads: "mousepads-printing",
};


const priceData = {
  // Flyers
  "flyers-printing": {
    "A5 - 130GSM": {
      color: { singleSide: 3, backToBack: 5 },
    },
    "A4 - 130GSM": {
      color: { singleSide: 5, backToBack: 8 },
    },
    "A4 - 170GSM Premium": {
      color: { singleSide: 7, backToBack: 12 },
    },
  },

  // Standees
  "standees-printing": {
    "Roll-up Standee - 6x3 ft": {
      color: { singleSide: 500, backToBack: null },
    },
    "Roll-up Standee - 6x2 ft": {
      color: { singleSide: 400, backToBack: null },
    },
    "Flex Standee - 6x3 ft": {
      color: { singleSide: 350, backToBack: null },
    },
  },

  // Posters
  "posters-printing": {
    "A3 - 130GSM Gloss": {
      color: { singleSide: 20, backToBack: null },
    },
    "A2 - 170GSM Gloss": {
      color: { singleSide: 40, backToBack: null },
    },
    "A1 - 200GSM Gloss": {
      color: { singleSide: 80, backToBack: null },
    },
  },

  // Banners
  "banners-printing": {
    "Flex Banner - 6x3 ft": {
      color: { singleSide: 120, backToBack: null },
    },
    "Flex Banner - 8x4 ft": {
      color: { singleSide: 180, backToBack: null },
    },
    "Vinyl Banner - 6x3 ft": {
      color: { singleSide: 200, backToBack: null },
    },
  },

  // Outdoor Signs
  "outdoor-signs-printing": {
    "Sunboard - 3mm (2x2 ft)": {
      color: { singleSide: 300, backToBack: null },
    },
    "Sunboard - 5mm (3x2 ft)": {
      color: { singleSide: 500, backToBack: null },
    },
    "Acrylic Sign - 2x1 ft": {
      color: { singleSide: 800, backToBack: null },
    },
  },

  // Mouse Pads
  "mousepads-printing": {
    "Standard - 7x9 in": {
      color: { singleSide: 150, backToBack: null },
    },
    "Large - 10x12 in": {
      color: { singleSide: 250, backToBack: null },
    },
    "Gaming - 12x18 in": {
      color: { singleSide: 400, backToBack: null },
    },
  },
};


export default function PosterSignsMousepads() { 
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
      
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="Posters, Signs & Mousepads"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Posters, Signs & Mousepads</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Bold visuals that speak volumes.</b> <br />
              Whether you're promoting an event or upgrading your workspace, our prints are built to stand out.
            </p>
              <ul className="list-disc ml-5 mt-2">
                <li>High-resolution, color-rich printing</li>
                <li>Multiple sizes and materials available</li>
                <li>Great for branding, décor, marketing, and gifting</li>
                <li>Indoor and outdoor options</li>
              </ul>
          </div>
        </div>
      </div>

    
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Poster & Signage</span> Subcategories
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
                      <th className="py-2 px-2 border-b text-left">Paper Type</th>
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
