import React from "react";
import diaryImg from "../../assets/daily essential/diary.png";
import mugImg from "../../assets/daily essential/mug.png";
import { Link } from "react-router-dom";

const products = [
  { id: 1, title: "Diaries", image: diaryImg, bgColor: "#F7F0EB" },
  { id: 2, title: "Mugs", image: mugImg, bgColor: "#8B6BBE" },
];

const DailyEssential = () => {
  return (
    <div className="w-full py-12 flex flex-col my-3 bg-white px-4 sm:px-6 lg:px-12">
      <h2 className="sm:text-4xl text-2xl font-bold mb-12 text-start whitespace-nowrap">
        Your Daily Essentials
      </h2>

      <div className="flex flex-wrap justify-center sm:justify-around gap-6 sm:gap-10 lg:gap-12">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            <div
              className="relative w-full sm:w-[300px] lg:w-[350px] h-[350px] sm:h-[380px] lg:h-[400px] flex justify-center items-center rounded-lg shadow-sm"
              style={{ backgroundColor: product.bgColor }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <button className="absolute bottom-6 left-6 bg-teal-600 hover:bg-teal-700 text-white px-5 py-1 rounded-full text-sm">
              <Link to={'/accessory-category-details'}> Buy Now </Link> 
              </button>
            </div>
            <p className="text-xl sm:text-2xl font-medium text-black mt-4">
              {product.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyEssential;
