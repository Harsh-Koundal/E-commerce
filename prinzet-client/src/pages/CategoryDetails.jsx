import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext"; // ✅ Import Cart Context
import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";
import CategoryDetailsPlaceholder from "@/components/Placeholders/CategoryDetailsPlaceholder";

const priceData = {
  "document-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 0.99, backToBack: 0.89 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 2.5, backToBack: 2 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "letterhead-printing": {
    "75GSM - Normal Paper": { color: { singleSide: 5.75 } },
    "100GSM - Duo Paper": { color: { singleSide: 6.66 } },
  },
  "certificates-printing": {
    "250GSM - Matte Paper": {
      blackWhite: { singleSide: 14 },
      color: { singleSide: 21 },
    },
    "250GSM - Glossy Paper": {
      blackWhite: { singleSide: 14 },
      color: { singleSide: 21 },
    },
    "300GSM - Matte Paper": {
      blackWhite: { singleSide: 15 },
      color: { singleSide: 23 },
    },
    "300GSM - Glossy Paper": {
      blackWhite: { singleSide: 15 },
      color: { singleSide: 22.5 },
    },
  },
  "visiting-card-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 5.75, backToBack: 5.25 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 7, backToBack: 7 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "poster-printing": {
    "250GSM - Matte Paper": {
      blackWhite: { singleSide: 23 },
      color: { singleSide: 37.5 },
    },
    "250GSM - Glossy Paper": {
      blackWhite: { singleSide: 23 },
      color: { singleSide: 37.5 },
    },
    "300GSM - Matte Paper": {
      blackWhite: { singleSide: 25 },
      color: { singleSide: 45 },
    },
    "300GSM - Glossy Paper": {
      blackWhite: { singleSide: 25 },
      color: { singleSide: 45 },
    },
  },
  "leaflet-flyers-pamphlet-printing": {
    "130GSM - Matte Paper": {
      blackWhite: { singleSide: 11, backToBack: 9 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "130GSM - Glossy Paper": {
      blackWhite: { singleSide: 11, backToBack: 9 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "170GSM - Matte Paper": {
      blackWhite: { singleSide: 12.5, backToBack: 10 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "170GSM - Glossy Paper": {
      blackWhite: { singleSide: 12.5, backToBack: 10 },
      color: { singleSide: 18, backToBack: 16.2 },
    },
  },
  "notebook-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 0.99, backToBack: 0.89 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 2.5, backToBack: 2 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "brochure-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 5.75, backToBack: 5.25 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 7, backToBack: 7 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "photo-album-printing": {
    "130GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "130GSM - Glossy Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "170GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "170GSM - Glossy Paper": { color: { singleSide: 18, backToBack: 16.2 } },
    "220GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "250GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "250GSM - Glossy Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "300GSM - Matte Paper": { color: { singleSide: 23, backToBack: 20.7 } },
    "300GSM - Glossy Paper": {
      color: { singleSide: 22.5, backToBack: 20.25 },
    },
  },
};

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ Use Cart Context

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryPrices, setSelectedSubcategoryPrices] =
    useState(null);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/categories/${categoryId}`
      )
      .then((response) => {
        setCategory(response.data.data);
        setSubcategories(response.data.data.subcategories || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Category not found");
        setLoading(false);
      });
  }, [categoryId]);

  const handleOrderNow = (subcategoryId = null) => {
    const orderPath = subcategoryId
      ? `/order-page/${categoryId}?subcategory=${subcategoryId}`
      : `/order-page/${categoryId}`;
    navigate(orderPath);
  };

  const handleShowPrices = (subcategoryId) => {
    setSelectedSubcategoryPrices(priceData[subcategoryId]);
  };

  const handleClosePrices = () => {
    setSelectedSubcategoryPrices(null);
  };


  if (loading) return <CategoryDetailsPlaceholder />;

  if (error)
    return (
      <div className="text-center text-red-500 text-xl mt-10 font-semibold">
        {error}
      </div>
    );

  if (!category) return null;

  const isSpecialCategory = ["3d-printing", "3d-infra-design"].includes(
    categoryId
  );

  return (
    <div className="container mx-auto px-6 md:px-6 lg:px-18 py-16">
      <BreadcrumbNavigation />
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="md:w-1/3">
          <img
            src={category.image}
            alt={category.name}
            className="w-full rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
            style={{ maxHeight: "350px", objectFit: "cover" }}
          />
        </div>

        {/* Details Section */}
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            {category.name}
          </h2>
          <p className="text-blue-600 mb-6 leading-relaxed">
            {category.description}
          </p>

          {isSpecialCategory ? (
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-100 to-blue-400 rounded-xl border border-gray-300 text-gray-700 shadow-lg">
              <p className="text-lg font-semibold">
                📩 For inquiries and requirements:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@printzet.com"
                  className="text-blue-600 hover:underline"
                >
                  info@printzet.com
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/8778253200"
                  className="text-green-600 hover:underline"
                >
                  8778253200
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  🖨️ Print Your Documents with Printzet:
                </p>
                <div className="ml-4 space-y-2 mt-2">
                  <p className="text-sm text-gray-700">
                    📄 Printzet offers fast, affordable, and high-quality{" "}
                    <strong>document printing</strong> services for all your
                    personal and professional needs.
                  </p>
                  <p className="text-sm text-gray-700">
                    📄 Need reliable <strong>online document printing</strong>?
                    PrintZet ensures top-notch prints delivered right to your
                    doorstep.
                  </p>
                  <p className="text-sm text-gray-700">
                    📄 Experience seamless{" "}
                    <strong>document printing online</strong> with PrintZet —
                    easy uploads, premium quality, and fast delivery.
                  </p>
                  <p className="text-sm text-gray-700">
                    📄 From business reports to academic projects, PrintZet
                    provides expert <strong>document printing solutions</strong>{" "}
                    at the best prices.
                  </p>
                  <p className="text-sm text-gray-700">
                    📄 Get your important files printed with PrintZet's trusted{" "}
                    <strong>online document printing service</strong> — simple,
                    secure, and speedy.
                    📄 Need reliable <strong>online document printing</strong>? Printzet ensures top-notch prints delivered right to your doorstep.
                  </p>
                </div>
              </div>

              <p className="text-sm text-red-500 mt-4">
                * Click "Details" on a subcategory to view pricing information.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subcategories */}
      <div id="subcategories" className="mt-10 md:mt-16 lg:mt-20">
        {subcategories.length > 0 ? (
          <>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Explore <span className="text-blue-600">Document </span>
              Subcategories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 md:h-52 lg:h-56">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                      {sub.name}
                    </h3>
                    {sub.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {sub.description}
                      </p>
                    )}

                    {/* Order + Details Row */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-full transition"
                        onClick={() => handleShowPrices(sub.id)}
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
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 text-center text-gray-700">
            <p>No subcategories available at the moment.</p>
          </div>
        )}
      </div>

      {/* Price Details Popup */}
      {selectedSubcategoryPrices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4">Price Details</h3>
            <ScrollArea className="h-96 w-full rounded-md border">
              <div className="p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">
                        Paper Type
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        Print Type
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        Single Side
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        Back to Back
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedSubcategoryPrices).map(
                      ([paperType, details]) =>
                        Object.entries(details).map(([printType, options]) => (
                          <tr key={`${paperType}-${printType}`}>
                            <td className="py-2 px-4 border-b">{paperType}</td>
                            <td className="py-2 px-4 border-b">
                              {printType === "blackWhite"
                                ? "Black & White"
                                : "Color"}
                            </td>
                            <td className="py-2 px-4 border-b">
                              ₹{options.singleSide}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {options.backToBack
                                ? `₹${options.backToBack}`
                                : "-"}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
};

export default CategoryDetails;
