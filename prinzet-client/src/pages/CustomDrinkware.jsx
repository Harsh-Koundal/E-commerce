import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";
import axios from "axios";

// Header Image
import headerImage from "../assets/images/custom-drinkware.png";

import {
  stationeryImg,
  stampsImg,
  postersImg,
  labelsImg,
  contactCards,
} from "@/assets/index.js";
import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";

export default function CustomDrinkware() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [subAccessories, setSubAccessories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState(null);

  useEffect(() => {
    const fetchDrinkware = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/accessorycategories/drinkware-printing`
        );

        setSubAccessories(response.data?.data?.subcategories || []);
      } catch (err) {
        console.error("Error fetching drinkware:", err);
      }
    };

    fetchDrinkware();
  }, []);

  const handleOrderNow = (subcategoryId) => {
    navigate(`/order-page/drinkware-printing?subcategory=${subcategoryId}`);
  };

  const handleClosePrices = () => setSelectedPrices(null);

  const exploreCategories = [
    { name: "Contact Cards", img: contactCards, redirect: "/contact-cards" },
    {
      name: "Stationery, Letterheads & Notebooks",
      img: stationeryImg,
      redirect: "/stationery",
    },
    { name: "Stamps & Inks", img: stampsImg, redirect: "/stamp-inks" },
    { name: "Posters & Signs", img: postersImg, redirect: "/posters" },
    {
      name: "Labels, Stickers & Packaging",
      img: labelsImg,
      redirect: "/packaging",
    },
  ];

  return (
    <div className="bg-gray-100 p-6 h-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <BreadcrumbNavigation/>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="Custom Drinkware"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />

          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Custom Drinkware</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>Drinkware that’s all you.</b> <br />
              From tumblers to bottles — personalize your daily essentials with
              stylish, durable prints.
            </p>
            <ul className="list-disc ml-5 mt-2">
              <li>Custom mugs, bottles, tumblers, and sippers</li>
              <li>Ceramic, plastic & premium steel options</li>
              <li>Perfect for hot & cold beverages</li>
              <li>Ideal for gifting & brand merchandise</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="shadow-md p-5 bg-white rounded-lg mt-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Explore <span className="text-blue-600">Drinkware</span> Subcategories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 md:gap-8 m-2">
          {subAccessories.map((sub, idx) => (
            <div
              key={idx}
              className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              <img
                src={sub.image}
                alt={sub.name}
                className="w-full h-80 object-cover"
              />

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {sub.name}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {sub.description}
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

      {/* Explore More */}
      <div className="text-center mt-10 mb-5 bg-white py-4 rounded-lg shadow-md p-0">
        <div className="flex justify-start items-center mb-4 bg-[#FDF1F2] w-fit p-4 rounded-r-full">
          <h2 className="text-2xl font-bold">Explore More Services :</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-6 py-6">
          {exploreCategories.map((cat) => (
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
          <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-full sm:max-w-lg md:max-w-2xl xl:max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
              {selectedPrices.name}
            </h3>

            <ScrollArea className="h-[50vh] rounded-md border p-4">
              <p className="text-gray-700 text-lg">
                {selectedPrices.description}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-xl mb-2">Base Price:</h4>
                <p className="text-lg">
                  ₹{selectedPrices.baseCost || "—"}
                </p>
              </div>

              {selectedPrices.customizationCosts && (
                <div className="mt-4">
                  <h4 className="font-semibold text-xl mb-2">
                    Customization Costs:
                  </h4>
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
