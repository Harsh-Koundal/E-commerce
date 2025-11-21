import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import cottonTShirtsImg from "@/assets/Featured Products/cottontshirts.png";
import contactCardsImg from "@/assets/Featured Products/contact_card.png";
import letterHeadImg from "@/assets/Featured Products/letterhead.png";
import postersImg from "@/assets/Featured Products/poster.png";
import bagPackImg from "@/assets/Featured Products/bagpack.png";
import cottonBagsImg from "@/assets/Featured Products/cottonbags.png";
import tumblersImg from "@/assets/Featured Products/tumblers.png";
import photoFrameImg from "@/assets/Featured Products/photoframes.png";
import { Link } from "react-router-dom";

const products = [
  { id: 1, title: "Custom T-Shirts", image: cottonTShirtsImg, bgColor: "#EBEFED" },
  { id: 2, title: "Contact Cards", image: contactCardsImg, bgColor: "#253C5E" },
  { id: 3, title: "Letterheads", image: letterHeadImg, bgColor: "#7D859F" },
  { id: 4, title: "Posters", image: postersImg, bgColor: "#47464A" },
  { id: 5, title: "Backpack", image: bagPackImg, bgColor: "#47464A" },
  { id: 6, title: "Cotton Bags", image: cottonBagsImg, bgColor: "#C4C5C8" },
  { id: 7, title: "Tumblers", image: tumblersImg, bgColor: "#7D859F" },
  { id: 8, title: "Photo Frames", image: photoFrameImg, bgColor: "#47464A" },
];

const getItemsPerPage = (width) => {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 4;
};

const FeaturedProducts = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage(window.innerWidth));
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage(window.innerWidth);
      setItemsPerPage(newItemsPerPage);
      setStartIndex((prev) => {
        if (prev + newItemsPerPage > products.length) {
          return Math.max(0, products.length - newItemsPerPage);
        }
        return prev;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + itemsPerPage, products.length - itemsPerPage));
  };

  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full px-4 py-8 bg-white mx-auto">
      <h2 className="sm:text-4xl text-2xl font-bold mb-6 text-start lg:ml-8">Featured Products</h2>

      <div className="relative flex items-center">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-0 z-10 p-2 md:p-3 rounded-full shadow bg-white border border-gray-300 
            ${startIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Previous products"
        >
          <FaChevronLeft className="text-gray-600" size={20} />
        </button>
        <div className="flex justify-around gap-4 md:gap-6 px-12 md:px-14 w-full overflow-hidden">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center flex-shrink-0 w-full sm:w-[45%] md:w-[220px]"
            >
              <div
                className="w-full rounded-2xl shadow-sm border border-gray-200"
                style={{ backgroundColor: product.bgColor }}
              >
                <div className="flex flex-col items-center py-6 px-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-32 h-36 md:w-40 md:h-44 object-contain mb-4"
                  />
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-1 rounded-full text-sm mb-3 transition">
                  <Link to={'/accessory-category-details'}>  Buy Now </Link>
                  </button>
                </div>
              </div>
              <p className="text-lg font-semibold text-center text-black mt-3">
                {product.title}
              </p>
            </div>
          ))}

        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= products.length}
          className={`absolute right-0 z-10 p-2 md:p-3 rounded-full shadow bg-white border border-gray-300 
            ${startIndex + itemsPerPage >= products.length ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Next products"
        >
          <FaChevronRight className="text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
