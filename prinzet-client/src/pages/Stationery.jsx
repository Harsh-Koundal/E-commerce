import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";

// Images
import headerImage from "../assets/images/stationery-head.png";
import noteBook from "../assets/images/notebooks-image.png";
import letterHead from "../assets/images/letterheads-image.png";
import brochuresImage from "../assets/images/brochures-image.png";
import sealStamp from "../assets/images/envelopes.png";
import idCards from "../assets/images/id-cards.png";

const categories = [
  {
    title: "Notebook",
    img: noteBook,
    description:
      "Custom notebooks with branded covers – perfect for office, events, or giveaways.",
  },
  {
    title: "Letterhead",
    img: letterHead,
    description:
      "Professional letterheads that reflect your brand identity on every page.",
  },
  {
    title: "Brochures & Booklets",
    img: brochuresImage,
    description:
      "High-quality brochures and booklets to showcase your business and services.",
  },
  {
    title: "Corporate Seal Stamps",
    img: sealStamp,
    description:
      "Custom corporate seals for official documentation and business use.",
  },
  {
    title: "ID Cards",
    img: idCards,
    description:
      "Durable, professional ID cards for employees, students, or events.",
  },
];

const categorySlugMap = {
  Notebook: "notebook-printing",
  Letterhead: "letterhead-printing",
  "Brochures & Booklets": "brochure-printing",
  "Corporate Seal Stamps": "seal-stamp-printing",
  "ID Cards": "id-card-printing",
};


const priceData = {
  "notebook-printing": {
    "A5 Notebook": { color: { singleSide: 120, backToBack: 200 } },
    "A4 Notebook": { color: { singleSide: 180, backToBack: 280 } },
  },
  "letterhead-printing": {
    "Standard 100gsm": { color: { singleSide: 250, backToBack: null } },
    "Premium 120gsm": { color: { singleSide: 350, backToBack: null } },
  },
  "brochure-printing": {
    "Tri-Fold": { color: { singleSide: 500, backToBack: 800 } },
    "Bi-Fold": { color: { singleSide: 450, backToBack: 700 } },
  },
  "seal-stamp-printing": {
    "Corporate Seal": { color: { singleSide: 600, backToBack: null } },
    "Embossing Seal": { color: { singleSide: 750, backToBack: null } },
  },
  "id-card-printing": {
    "PVC ID Card": { color: { singleSide: 80, backToBack: 120 } },
    "Smart Chip Card": { color: { singleSide: 300, backToBack: null } },
  },
};

export default function Stationery() {
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
            alt="Stationery"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3 ">
            <h1 className="text-3xl font-bold mb-2">
              Stationery, Letterheads & Notebooks
            </h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Put your brand on every page</b>
              <br />
              </p>
              Professional, well-designed stationery that elevates your
              day-to-day. Great for both office use and thoughtful gifting.
              <ul className="list-disc list-inside mt-2">
                <li>Premium quality paper and print</li>
                <li>Personalized layouts to match your brand</li>
                <li>Ideal for internal use, events, and corporate gifting</li>
                <li>Bulk pricing available</li>
              </ul>
            
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Stationery</span> Subcategories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 md:gap-8 m-2">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >

              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-80 object-cover"
              />


              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-4 pt-0">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-full transition"
                  onClick={() => handleShowPrices(cat.title)}
                >
                  Details
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
                  onClick={() => handleOrderNow(cat.title)}
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
                        Type
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b text-left">
                        Print
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
                    {Object.entries(selectedPrices).map(([type, details]) =>
                      Object.entries(details).map(([printType, options]) => (
                        <tr key={`${type}-${printType}`}>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                            {type}
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
