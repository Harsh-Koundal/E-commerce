import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";
import axios from "axios";

import headerImage from "../assets/images/header-image.png"; // keep or replace with your document header

export default function DocumentPrinting() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/accessorycategories/document-printing`
        );
        const subcats =
          response.data?.data?.subcategories ||
          response.data?.subcategories ||
          [];
        setCategories(subcats);
      } catch (err) {
        console.error("Error fetching document categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleOrderNow = (subcategoryId) => {
    navigate(`/order-page/document-printing?subcategory=${subcategoryId}`);
  };

  const handleClosePrices = () => setSelectedPrices(null);

  return (
    <div className="bg-gray-100 p-6 h-full">
      {/* Header */}
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
              Get high-quality prints for all your document needs — letterheads,
              certificates, notebooks and more. Clear, crisp, and ready when you need them.
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Document</span> Subcategories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 md:gap-8 m-2">
          {categories.map((sub, idx) => (
            <div
              key={sub.id || idx}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              <img
                src={sub.image}
                alt={sub.name || sub.title}
                className="w-full h-80 object-cover"
              />

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {sub.name || sub.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {sub.description ||
                    "Professional printing for business and personal use."}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-4 pt-0">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-full transition"
                  onClick={() => setSelectedPrices(sub)}
                >
                  Details
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
                  onClick={() => handleOrderNow(sub.id)}
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
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-full sm:max-w-lg md:max-w-2xl xl:max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
              {selectedPrices.name || selectedPrices.title}
            </h3>

            <ScrollArea className="h-[50vh] rounded-md border p-4">
              <p className="text-gray-700 text-lg">{selectedPrices.description}</p>

              {/* show baseCost if present */}
              {selectedPrices.baseCost !== undefined && (
                <div className="mt-4">
                  <h4 className="font-semibold text-xl mb-2">Base Price:</h4>
                  <p className="text-lg">₹{selectedPrices.baseCost}</p>
                </div>
              )}

              {/* show customizationCosts if present */}
              {selectedPrices.customizationCosts && (
                <div className="mt-4">
                  <h4 className="font-semibold text-xl mb-2">Customization Costs:</h4>
                  <ul className="list-disc ml-6">
                    {Object.entries(selectedPrices.customizationCosts).map(
                      ([key, value]) => (
                        <li key={key} className="text-lg capitalize">
                          {key}: ₹{value}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* if the subcategory contains price tables (like cost objects), render them */}
              {selectedPrices.costPerCopy && (
                <div className="mt-4">
                  <h4 className="font-semibold text-xl mb-2">Price Table:</h4>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm sm:text-base md:text-lg">
                      <thead>
                        <tr>
                          <th className="py-2 px-2 border-b text-left">Option</th>
                          <th className="py-2 px-2 border-b text-left">Single Side</th>
                          <th className="py-2 px-2 border-b text-left">Back to Back</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedPrices.costPerCopy).map(
                          ([opt, prices]) => (
                            <tr key={opt}>
                              <td className="py-2 px-2 border-b">{opt}</td>
                              <td className="py-2 px-2 border-b">
                                {prices.singleSide ? `₹${prices.singleSide}` : "-"}
                              </td>
                              <td className="py-2 px-2 border-b">
                                {prices.backToBack ? `₹${prices.backToBack}` : "-"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="mt-6 text-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
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
