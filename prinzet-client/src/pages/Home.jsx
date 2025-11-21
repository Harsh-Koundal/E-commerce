import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import categories from "../data/categories";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import images (ensure these paths are correct for your project structure)
import slider1Img from "../assets/home-slider/slider1Img.jpg";
import slider2Img from "../assets/home-slider/slider2Img.jpg";
import slider3Img from "../assets/home-slider/slider3Img.jpg";
import slider4Img from "../assets/home-slider/slider4Img.jpg";
import slider5Img from "../assets/home-slider/slider5Img.jpg";
import aboutUsImg from "../assets/images/about-us.jpg";

// Mock data (replace with your actual data)
const featuredProducts = [
  { id: 1, name: "Flex Banners", image: "/images/flex-banner.jpg" },
  { id: 2, name: "Mugs", image: "/images/mugs.jpg" },
  { id: 3, name: "Business Cards", image: "/images/business-cards.jpg" },
];

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const customerReviews = [
  {
    name: "Anirudh Sharma",
    username: "@anirudh7",
    body: "Fast delivery and top-notch print quality! Highly recommend Printzet.",
    img: "/images/Customer1.png",
  },
  {
    name: "Meera Joshi",
    username: "@meeraj",
    body: "Good service overall, but packaging can improve.",
    img: "/images/Customer2.png",
  },
  {
    name: "Ravi Verma",
    username: "@ravi_v",
    body: "Loved the mug prints! Perfect colors and quick service.",
    img: "/images/Customer3.png",
  },
  {
    name: "Priya Sen",
    username: "@priyas",
    body: "Excellent customer support and great print quality.",
    img: "/images/Customer4.png",
  },
  {
    name: "Kunal Kapoor",
    username: "@kunalk",
    body: "Very satisfied with the banner printing service.",
    img: "/images/Customer4.png",
  },
  {
    name: "Shalini Nair",
    username: "@shalinin",
    body: "The business cards look professional. Thank you!",
    img: "/images/Customer4.png",
  },
];

const firstRowReviews = customerReviews.slice(
  0,
  Math.ceil(customerReviews.length / 2)
);
const secondRowReviews = customerReviews.slice(
  Math.ceil(customerReviews.length / 2)
);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm italic">
        &ldquo;{body}&rdquo;
      </blockquote>
    </figure>
  );
};

export function MarqueeReviews() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRowReviews.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s] mt-4">
        {secondRowReviews.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
    </div>
  );
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [documentSubcategories, setDocumentSubcategories] = useState([]);
  const [accessorySubcategories, setAccessorySubcategories] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);

    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/categories/document-printing`
      )
      .then((res) =>
        setDocumentSubcategories(res.data.data.subcategories || [])
      )
      .catch((err) =>
        console.error("Error fetching document subcategories:", err)
      );

    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/accessorycategories/accessory-printing`
      )
      .then((res) =>
        setAccessorySubcategories(res.data?.data.subcategories || [])
      )
      .catch((err) =>
        console.error("Error fetching accessory subcategories:", err)
      );
  }, []);

  const handleHeroButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      document
        .getElementById("categories")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    hover: { scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] bg-gradient-to-br from-gray-900  to-black">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: ".custom-swiper-button-prev",
            nextEl: ".custom-swiper-button-next",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {[slider1Img, slider2Img, slider3Img, slider4Img, slider5Img].map(
            (img, index) => (
              <SwiperSlide key={index} className="relative">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-8">
                  <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-extrabold text-shadow-lg"
                  >
                    Print Smart, Print Fast,{" "}
                    <span className="text-blue-400 drop-shadow-md">
                      Printzet
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl mt-4 max-w-3xl leading-relaxed font-light"
                  >
                    Experience the pinnacle of printing excellence. High-quality
                    solutions for documents, accessories, and 3D prints,
                    tailored to your every need.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Button
                      onClick={handleHeroButtonClick}
                      className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg
                        rounded-full shadow-lg transition-all duration-300
                        border-2 border-blue-500/50 hover:border-blue-500/80
                        hover:scale-105"
                    >
                      Place Order
                    </Button>
                  </motion.div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
        {/* Custom Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8">
          <button
            className="custom-swiper-button-prev bg-white/20 hover:bg-white/30 text-white
                       rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center
                       transition-colors duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="custom-swiper-button-next bg-white/20 hover:bg-white/30 text-white
                       rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center
                       transition-colors duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Padded Sections */}
      <div className="py-24 px-6 md:px-16 lg:px-24">
        {/* About Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12"
          id="about"
        >
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">
              About <span className="text-blue-500">Printzet</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Printzet is where innovation meets printing. We're dedicated to
              providing unparalleled quality and service in every print. From
              bespoke documents to unique 3D creations, we bring your ideas to
              life with precision and passion. Experience the future of printing
              with us.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-block bg-blue-500 text-white px-8 py-3 rounded-full
                         hover:bg-blue-600 transition-all duration-300 font-semibold
                         hover:scale-105 shadow-md border-2 border-blue-500/50
                         hover:border-blue-500/80"
            >
              Learn More
            </Link>
          </div>
          <div className="md:w-1/2">
            <motion.img
              src={aboutUsImg}
              alt="About Us"
              className="rounded-xl shadow-2xl w-full"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="py-16 px-6 md:px-16 lg:px-24">
        {/* Services Section */}
        <div className="container mx-auto px-6" id="categories">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
            Our <span className="text-blue-500">Services</span>
          </h2>
          <div className="grid grid-cols-1 gap-12">
            {/* Document Printing Category */}
            {documentSubcategories.length > 0 && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-semibold text-gray-700 tracking-tight">
                    <span className="text-blue-500">Document</span> 
                  </h3>
                  <Link
                    to={`/category/document-printing`}
                    className="hidden md:inline text-blue-500 font-semibold hover:scale-105
                                hover:underline transition-colors duration-300"
                  >
                    Explore More
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {documentSubcategories.slice(0, 5).map((sub) => (
                    <motion.div
                      key={sub.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover="hover"
                      className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 group"
                    >
                      {/* Image */}
                      <div className="h-64 overflow-hidden">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover rounded-t-xl transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                        />
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl">
                          <h4 className="text-white text-lg font-bold mb-2">
                            {sub.name}
                          </h4>
                          <p className="text-white text-sm leading-relaxed mb-4">
                            {sub.description}
                          </p>
                          <Link
                            to={`/category/document-printing`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all duration-300"
                          >
                            Explore More
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center w-full md:hidden">
                  <Link
                    to={`/category/document-printing`}
                    className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full
                               hover:bg-blue-600 transition-all duration-300 font-semibold
                               hover:scale-105 shadow-md border-2 border-blue-500/50
                               hover:border-blue-500/80"
                  >
                    Explore More
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Accessory Printing Category */}
            {accessorySubcategories.length > 0 && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-semibold text-gray-700 tracking-tight">
                    <span className="text-blue-500">Accessory</span> Printing
                  </h3>
                  <Link
                    to="/accessory-category-details"
                    className="hidden md:inline text-blue-500 font-semibold
                               hover:scale-105 hover:underline transition-colors duration-300"
                  >
                    Explore More
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {accessorySubcategories.slice(0, 5).map((sub) => (
                    <motion.div
                      key={sub.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover="hover"
                      className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 group"
                    >
                      {/* Image */}
                      <div className="h-64 overflow-hidden">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover rounded-t-xl transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                        />
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl">
                          <h4 className="text-white text-lg font-bold mb-2">
                            {sub.name}
                          </h4>
                          <p className="text-white text-sm leading-relaxed mb-4">
                            {sub.description}
                          </p>
                          <Link
                            to={`/accessory-category-details`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all duration-300"
                          >
                            Explore More
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center w-full md:hidden">
                  <Link
                    to={`/accessory-category-details`}
                    className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full
                               hover:bg-blue-600 transition-all duration-300 font-semibold
                               hover:scale-105 shadow-md border-2 border-blue-500/50
                               hover:border-blue-500/80"
                  >
                    Explore More
                  </Link>
                </div>
              </motion.div>
            )}

            {/* 3D Printing Category */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full"
            >
              <h2 className="text-3xl font-semibold text-gray-700 tracking-tight mb-8">
                <span className="text-blue-500">3D</span> Printing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {categories.slice(2, 4).map((category) => (
                  <motion.div
                    key={category.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover="hover"
                    className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 group"
                  >
                    {/* Image */}
                    <div className="h-64 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-t-xl transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                      />
                    </div>

                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl">
                        <h4 className="text-white text-lg font-bold mb-2">
                          {category.name}
                        </h4>
                        <p className="text-white text-sm leading-relaxed mb-4">
                          {category.description}
                        </p>
                        <Link
                          to={`/category/${category.id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all duration-300"
                        >
                          Explore More
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pt-16 px-6 md:px-16 lg:px-24">
        {/* Featured Products */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
            Featured <span className="text-blue-500">Products</span> & Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
                className="bg-white shadow-lg rounded-xl border border-gray-200
                           flex flex-col items-center justify-between p-4 transition-all duration-300"
              >
                <div className="h-64 w-full overflow-hidden rounded-md flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300
                               hover:scale-105"
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-700 text-center">
                  {product.name}
                </h3>
                <Badge
                  variant="outline"
                  className="mt-2 text-blue-500 border-blue-500/50"
                >
                  Special Discounts Available
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="py-12">
          {/* Customers with Reviews */}
          <div className="container mx-auto px-6 rounded-xl">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
              What Our <span className="text-blue-500">Customers</span> Say
            </h2>
            <MarqueeReviews />
          </div>
        </div>
        <div className="py-12 px-6 md:px-16 lg:px-24">
          {/* Bulk Ordering */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-r from-indigo-100 to-blue-400 shadow-lg p-6 sm:p-8 md:p-12 
               text-gray-700 text-center transition-all duration-300 rounded-2xl max-w-4xl mx-auto"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mb-4 sm:mb-6 tracking-tight">
              Bulk Ordering Options
            </h3>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We provide tailored bulk ordering solutions for businesses and
              institutions.
            </p>
            <p className="mt-3 sm:mt-4 text-gray-600">
              Send us your requirements and inquiries:
            </p>
            <p className="font-medium mt-2">
              📧{" "}
              <a
                href="mailto:info@printzet.com"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:underline break-words overflow-wrap break-word"
              >
                info@printzet.com
              </a>
            </p>
            <p className="font-medium mt-1">
              📱{" "}
              <a
                href="https://wa.me/7325966706"
                className="text-green-600 hover:text-green-700 transition-colors duration-300 hover:underline"
              >
                +91 73259 66706
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
