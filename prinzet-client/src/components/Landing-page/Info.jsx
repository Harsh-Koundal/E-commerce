import React from "react";
import {logoImg} from "@/assets"

const Info = () => {
  return (
    <div className="bg-white py-10 px-6 lg:px-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-3">
          <div>
            <img
              src={logoImg}
              alt="Printzet Logo"
              className="w-44 h-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
              Printzet : From Pixels To Precision
            </h2>
            <div className="space-y-3 pl-2 text-gray-700  leading-relaxed">
              <p>
                At Printzet, we bring your ideas to life with premium printing on mugs,
                t-shirts, gifts, and even 3D printing — made to look good, feel better,
                and last long.

                Based in Odisha and delivering PAN India, we blend top-quality materials
                with eye-catching design.

                With a promise of 100% customer satisfaction, every product is crafted to
                make a lasting impression.
              </p>
              <p className="font-bold italic ">
                Crafted with care, designed to stay.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-10">
          {[
            {
              title: "100% Customer Satisfaction",
              desc1:
                "Your happiness is our promise — 100% customer satisfaction guaranteed.",
              desc2: "Top-notch quality, bold designs, and zero compromise.",
            },
            {
              title: "High Quality Products & Designs",
              desc1:
                "Crafted with precision, printed to perfection, we deliver nothing but the best.",
              desc2:
                "Premium materials. Precise prints. Products that turn heads and last.",
            },
            {
              title: "PAN Delivery",
              desc1:
                "From metro cities to small towns, we deliver everywhere.",
              desc2: "Fast. Reliable. Right to your doorstep.",
            },
          ].map((item, index) => (
            <div
              key={index}
            >
              <h3 className="text-2xl font-semibold mb-3 lg:mt-10">
                {item.title}
              </h3>
              <p className="ml-2 mb-2 ">{item.desc1}</p>
              <p className="ml-2">{item.desc2}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
