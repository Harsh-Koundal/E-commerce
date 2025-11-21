import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import {
    leftImage,
    rightImg
} from "@/assets";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
const searchRoutes = {
  // Products & Services
  document: "/document-printing",
  certificates: "/document-printing",
  "business cards": "/document-printing",
  "contact cards": "/contact-cards",
  "stamps": "/stamp-inks",
  inks: "/stamp-inks",
  stationery: "/stationery",
  letterheads: "/stationery",
  notebooks: "/stationery",
  brochure: "/stationery",
  booklets: "/stationery",
  "id cards": "/stationery",
  posters: "/posters",
  flyers: "/posters",
  standees: "/posters",
  banners: "/posters",
  "outdoor signs": "/posters",
  "mouse pads": "/posters",
  packaging: "/packaging",
  labels: "/packaging",
  stickers: "/packaging",
  accessories: "/accessories",
  mugs: "/accessories",
  "photo albums": "/accessories",
  "gift wraps": "/accessories",
  cloths: "/clothing",
  bag:"/clothing",
  cap:"/clothing",
  backpack:"/clothing",
  "t-shirt":"/clothing",
  shirt:"/clothing",
  "anime printed t-shirt":"/clothing",
  drinkware: "/drinkware",
  "water tumbler": "/drinkware",
  "coffee tumbler": "/drinkware",
  "custom printed bottels": "/drinkware",
  sippers: "/drinkware",
  "3d printing": "/category/3d-printing",
  "3d infra": "/3D-infra",
  
  // Info Pages
  careers: "/careers",
  faqs: "/faqs",
  blog: "/blog",
  policies: "/policies",
  "price calculator": "/price-calculator",
  support: "/support",

};

    const [query, setQuery] = useState("")
    const navigate = useNavigate();
   function handelSearch() {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return; 

  for (let keyword in searchRoutes) {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerKeyword.includes(lowerQuery) || lowerQuery.includes(lowerKeyword)) {
      navigate(searchRoutes[keyword]);
      return;
    }
  }

  navigate("/not-found");
}

    return (
        <section className="w-full">
            <div className="flex flex-col md:flex-row w-full min-h-[90vh] md:h-[85vh]">
                {/* LEFT SIDE */}
                <div
                    className="lg:w-2/3 md:w-[60%] flex items-center justify-center text-center p-6 md:p-12 bg-white"
                    style={{
                        backgroundImage: `url(${leftImage})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="max-w-2xl w-full">
                        <h3 className="text-4xl lg:text-5xl font-bold text-[#2b2220]">
                            Search
                        </h3>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-1 text-[#d21a8a] whitespace-nowrap">
                            Products &amp; Services
                        </h1>

                        {/* Search Bar */}
                        <div className="mt-10">
                            <div className="flex mx-auto items-center max-w-md rounded-full overflow-hidden shadow">
                                <input
                                    type="text"
                                    placeholder="Search Services"
                                    className="flex-1 px-3 md:px-5 py-3 bg-[#262525] text-gray-100 placeholder-gray-400 focus:outline-none rounded-l-full"
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e)=>{if(e.key==="Enter"){
                                        handelSearch()
                                    }}}
                                />
                                <button className="px-5 py-3 bg-[#FFD86B] rounded-r-full flex items-center gap-2 font-medium justify-center" onClick={handelSearch}>
                                    <FaSearch className="my-1" />
                                    <span className="hidden md:flex">Search</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    className="lg:w-1/3 md:w-[40%] flex flex-col justify-end items-center"
                    style={{ backgroundColor: "#c96b78" }}
                >
                    <div className="w-full">
                        <img
                            src={rightImg}
                            alt="Printzet App"
                            className="w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
