import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import {
  documentsImg,
  accessoryPrinting,
  printing3D,
  printing3DImg,
  infra3D,
  documentImg,
  stationeryImg,
  stampsImg,
  postersImg,
  labelsImg,
  clothing,
  mugs,
  drinkware,
  contactCards
} from "@/assets/index.js";

import { Link } from "react-router-dom";

const categoriesTop = [
  {
    name: "Documents",
    img: documentsImg,
    dropdown: [
      { name: "Document Printing", redirect: "/category/document-printing" },
      { name: "Letterhead Printing", redirect: "/stationery" },
      { name: "Certificate Printing", redirect: "/document-printing" },
      { name: "Notebook Printing", redirect: "/stationery" },
      { name: "Brochure Printing", redirect: "/document-printing" },
      { name: "Poster Printing", redirect: "/posters" },
      { name: "Visiting Card", redirect: "/contact-cards" },
      { name: "Leaflet/Flyer/Pamphlet", redirect: "/posters" },
      { name: "Photo Album Printing", redirect: "/acessories" },
    ],
    redirect: "/category/document-printing",
  },
  {
    name: "Accessory Printing",
    img: accessoryPrinting,
    dropdown: [
      { name: "Custom Polo T-Shirt", redirect: "/clothing" },
      { name: "Office T-Shirt", redirect: "/clothing" },
      { name: "Custom T-shirts", redirect: "/clothing" },
      { name: "Custom Stamps & Inks", redirect: "/stamp-inks" },
      { name: "Photo Gifts", redirect: "/acessories" },
      { name: "Custom Caps", redirect: "/clothing" },
      { name: "Custom Drinkware", redirect: "/drinkware" },
      { name: "Custom Bags", redirect: "/clothing" },
    ],
    redirect: "/accessory-category-details",
  },
  {
    name: "3D Printing",
    img: printing3D,
    redirect: "/category/3d-printing",
  },
  {
    name: "3D Infra (Coming Soon)",
    img: infra3D,
    redirect: "/3D-infra",
  },
];

const exploreCategories = [
  { name: "Documents", img: documentImg, redirect: "/category/document-printing" },
  { name: "Stationery, Letterheads & Notebooks", img: stationeryImg, redirect: "/stationery" },
  { name: "Stamps & Inks", img: stampsImg, redirect: "/stamp-inks" },
  { name: "Posters & Signs", img: postersImg, redirect: "/posters" },
  { name: "Labels, Stickers & Packaging", img: labelsImg, redirect: "/packaging" },
  { name: "Clothing, Caps & Bags", img: clothing, redirect: "/clothing" },
  { name: "Mugs, Albums & Gifts", img: mugs, redirect: "/acessories" },
  { name: "Custom Drinkware", img: drinkware, redirect: "/drinkware" },
  { name: "3D Printing", img: printing3DImg, redirect: "/category/3d-printing" },
  { name: "Contact Cards", img: contactCards, redirect: "/contact-cards" }
];

const PrintingCategories = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="w-full bg-[#D9D3D3] p-4 border-4 border-gray-300 lg:mt-2">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 border bg-white rounded-lg border-gray-300 p-6 whitespace-nowrap">
        {categoriesTop.map((cat, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center cursor-pointer"
            ref={activeDropdown === index ? dropdownRef : null}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-28 h-28 md:w-28 md:h-28 object-contain mb-2"
            />
            <div
              className="flex items-center gap-1 select-none"
              onClick={() => handleCategoryClick(index)}
            >
              <p className="text-sm font-medium text-gray-900">{cat.name}</p>
              {cat.dropdown && cat.dropdown.length > 0 && (
                <ChevronDown
                  size={20}
                  className={`text-gray-700 transition-transform ${
                    activeDropdown === index ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
            {cat.dropdown && cat.dropdown.length > 0 && activeDropdown === index && (
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 max-w-[90vw] bg-white border border-gray-200 shadow-lg z-50 rounded-md text-sm"
                ref={dropdownRef}
              >
                {cat.dropdown.map((item, i) => (
                  <Link to={item.redirect} key={i}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {!cat.dropdown && (
              <Link to={cat.redirect} className="absolute inset-0" />
            )}
          </div>
        ))}
      </div>

      <div className="border border-gray-300 mb-4 bg-white rounded-lg">
        <div className="inline-block bg-pink-100 px-6 py-6 rounded-r-full text-2xl sm:text-3xl font-semibold mt-5 select-none">
          Explore More :
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

      <div className="border border-gray-300 bg-white rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-6 py-10">
          {exploreCategories.slice(5).map((cat) => (
            <Link key={cat.name} to={cat.redirect}>
              <div className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-md flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover"
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
    </div>
  );
};

export default PrintingCategories;
