import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";

// Images
import headerImage from "../assets/images/stamp-ink.png";
import signatureStamp from "../assets/images/signature-stamp.png";
import rubberStamp from "../assets/images/rubber-stamp.png";
import dateStamp from "../assets/images/date-stamp.png";
import sealStamp from "../assets/images/seal-stamp.png";
import inks from "../assets/images/inks.png";

const categories = [
  {
    title: "Signature Stamp",
    img: signatureStamp,
    description:
      "Custom signature stamps for quick approvals, documents, and everyday office use.",
  },
  {
    title: "Rubber Stamp",
    img: rubberStamp,
    description:
      "Durable and long-lasting rubber stamps designed for official and business use.",
  },
  {
    title: "Date Stamp",
    img: dateStamp,
    description:
      "Convenient date stamps for marking records, invoices, and time-sensitive files.",
  },
  {
    title: "Corporate Seal Stamps",
    img: sealStamp,
    description:
      "Professional corporate seal stamps for businesses, legal documents, and certifications.",
  },
  {
    title: "Inks",
    img: inks,
    description:
      "High-quality stamp inks available in multiple colors for clear and sharp impressions.",
  },
];

const categorySlugMap = {
  "Signature Stamp": "signature-stamp-printing",
  "Rubber Stamp": "rubber-stamp-printing",
  "Date Stamp": "date-stamp-printing",
  "Corporate Seal Stamps": "seal-stamp-printing",
  "Inks": "inks-printing",
};


const priceData = {
  "signature-stamp-printing": {
    "Self-Inking": { color: { singleSide: 250, backToBack: null } },
    "Pre-Inked": { color: { singleSide: 300, backToBack: null } },
  },
  "rubber-stamp-printing": {
    "Standard Rubber": { color: { singleSide: 200, backToBack: null } },
    "Heavy Duty": { color: { singleSide: 350, backToBack: null } },
  },
  "date-stamp-printing": {
    "Manual Date Stamp": { color: { singleSide: 280, backToBack: null } },
    "Self-Inking Date Stamp": { color: { singleSide: 400, backToBack: null } },
  },
  "seal-stamp-printing": {
    "Corporate Seal": { color: { singleSide: 600, backToBack: null } },
    "Embossing Seal": { color: { singleSide: 750, backToBack: null } },
  },
  "inks-printing": {
    "Black Ink Bottle": { color: { singleSide: 100, backToBack: null } },
    "Colored Ink Bottle": { color: { singleSide: 150, backToBack: null } },
  },
};

export default function StampInks() {
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
            alt="Stamps & Inks"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Stamps & Inks</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Clean. Sharp. Built for daily use.</b>
              <br />
              Custom stamps made to simplify your workflow with long-lasting ink
              and precise impressions.
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Self-inking, pre-inked, and traditional rubber options</li>
                <li>Custom text, logos, and formats</li>
                <li>Designed for office, business, or admin use</li>
                <li>Mess-free, durable, and efficient</li>
              </ul>
            
          </div>
        </div>
      </div>


      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Stamps & Inks</span>{" "}
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
