import React from "react";
import { FaCircle } from "react-icons/fa";
import aboutImg from "../assets/images/machine.png";
import logo from "../assets/images/logo.png";

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
      {/* Background circles */}
      {/* <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-80"></div>
      <div className="absolute top-1/4 left-[75%] w-24 h-24 bg-pink-200 rounded-full opacity-70"></div>
      <div className="absolute bottom-[40%] left-[65%] w-16 h-16 bg-pink-300 rounded-full opacity-70"></div>
      <div className="absolute top-[40%] right-[15%] w-20 h-20 bg-pink-200 rounded-full opacity-60"></div>
      <div className="absolute bottom-10 right-[25%] w-14 h-14 bg-pink-400 rounded-full opacity-75"></div> */}
      <div className="absolute rounded-full opacity-15 z-0 pointer-events-none w-[240px] h-[240px] bg-[#e5a5ea] top-[60px] right-[10%]"></div>
      <div className="absolute rounded-full opacity-15 z-0 pointer-events-none w-[180px] h-[180px] bg-[#feaee5] bottom-[50px] left-[12%]"></div>
      <div className="absolute rounded-full opacity-15 z-0 pointer-events-none w-[90px] h-[90px] bg-[#d50079] bottom-[140px] right-[23%]"></div>


      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        {/* <img src={logo} alt="Printzet Logo" className="h-14 mb-2" /> */}
        <h1 className="text-6xl font-bold tracking-wide">About Us</h1>
      </div>

      {/* Main section */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-16">
        {/* Left Image */}
        <div className="flex-shrink-0 w-full lg:w-1/2 flex">
          <img
            src={aboutImg}
            alt="Printing Machine"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>


        {/* Right Text Box */}
        <div
          className="rounded-xl shadow-lg p-6 lg:p-8 w-full lg:w-1/2 border border-gray-100 flex flex-col justify-center"
          style={{ backgroundColor: "#fbd6e3" }}
        >
          <p className="mb-4 text-gray-1000 leading-relaxed">
            Printzet is where sharp design meets smart printing. Born in Bhubaneswar, Odisha,
            we started with one mission — to transform printing from a simple necessity into an
            elevated, hassle-free experience. What began as a small creative workspace has grown
            into a full-fledged printing hub serving clients across India.
          </p>

          <p className="mb-4 text-gray-1000 leading-relaxed">
            We’re not just a printing shop. We are a passionate team of makers, designers,
            and perfectionists who believe every project — whether it’s a single-page print
            or a hundred custom designs — deserves equal attention and care. From perfect
            color matching to premium material selection, every detail is handled with precision.
          </p>

          <p className="mb-4 text-gray-1000 leading-relaxed">
            Our approach is simple: combine creative design, advanced printing technology, and
            a dedication to customer satisfaction. We make sure your prints not only look good
            but feel premium in every sense. And we do it fast — without compromising on quality.
          </p>

          <h3 className="font-semibold mt-4 mb-2 text-lg">Our services include:</h3>
          <ul className="list-disc list-inside text-gray-1000 space-y-1">
            <li>High-quality digital printing (flyers, brochures, invitations, business cards)</li>
            <li>Project printing, architectural plans & AutoCAD map prints</li>
            <li>Personalized I-cards, flex boards & signage</li>
            <li>Custom gift printing (mugs, tote bags, 3D keepsakes, and more)</li>
            <li>Complete branding kits & marketing collaterals</li>
            <li>Photocopy, lamination & design consultation services</li>
          </ul>

          <p className="mt-4 text-gray-1000 leading-relaxed">
            Whether you’re an individual looking to create a unique gift, a student working on
            an important project, or a business in need of consistent brand printing — Printzet
            delivers with speed, reliability, and creativity. We offer PAN India delivery,
            competitive pricing, and results designed to make an impact.
          </p>

          <p className="mt-4 font-semibold text-gray-1000">
            Fast turnaround. Unmatched quality. A printing experience that’s as vibrant as your ideas.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <div
          className="flex items-start gap-4 p-4 rounded-lg"
          style={{ backgroundColor: "#fbd6e3" }}
        >
          <FaCircle className="text-red-600 mt-1" size={30} />
          <div>
            <h4 className="font-bold mb-1">Mission</h4>
            <p className="text-gray-1000">
              To help people and businesses stand out through high-quality
              printing, thoughtful design, and reliable service. We make prints
              that don’t just look good — they work harder for your brand, your
              message, and your ROI.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div
          className="flex items-start gap-4 p-4 rounded-lg"
          style={{ backgroundColor: "#fbd6e3" }}
        >
          <FaCircle className="text-red-600 mt-1" size={30} />
          <div>
            <h4 className="font-bold mb-1">Vision</h4>
            <p className="text-gray-1000">
              To be the go-to printing partner for modern businesses — by
              combining innovation, creativity, and top-tier support. We want to
              make printing smarter, faster, and more impactful for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
