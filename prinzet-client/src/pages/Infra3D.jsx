import React, { useState } from "react";
import headerImage from "../assets/images/3D-infra-head.png";
import infra3Dupcoming from "../assets/images/3d-infra-upcoming.png";



export default function infra3dUpcoming() { 

  return (
    <div className="bg-gray-100 p-6 h-full">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={headerImage}
            alt="3D Infra Design"
            className="w-full md:w-1/3 rounded-lg 2xl:w-3/12 hover:scale-105 transition-transform duration-300"
          />
          <div className="bg-[#FDF1F2] p-6 rounded-lg w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">3D Infra Design (Upcoming)</h1>
            <hr />
            <p className="text-gray-700 text-lg">
              <b>The future of ideas — printed.</b> <br />
              We’re launching 3D printing services for everything from prototypes to large-scale infrastructure models.
            </p>
            <ul className="list-disc ml-5 mt-2">
              <li>Designed for architects, engineers, and creators</li>
              <li>Detailed, durable, and precisely engineered</li>
              <li>High-end customization</li>
              <li>Stay tuned — it’s coming soon</li>
            </ul>
          </div>
        </div>
      </div>
        <div className="bg-white rounded-lg p-6 shadow-md mt-5 flex flex-col items-center relative overflow-hidden">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <img
            className="w-full rounded-lg"
            src={infra3Dupcoming}
            alt="3D Infra Upcoming"
          />
        </div>

        <div className="absolute inset-0 flex justify-center items-center text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg">
            Upcoming
          </h1>
        </div>
        <p className="text-base md:text-lg mt-2 drop-shadow-md">
            3D Infratech
          </p>
      </div>
    </div>
  );
}
