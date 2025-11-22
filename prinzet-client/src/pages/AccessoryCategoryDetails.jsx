import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "../context/CartContext";
import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";
import AccessoryCategoryDetailsPlaceholder from "@/components/Placeholders/AccesoryCategoryDetailsPlaceholder";

const accessoryPriceData = {
  "custom-polo-t-shirts": {
    "Standard Polo": { price: 600 },
    "Premium Polo": { price: 800 },
    "Custom Design Polo": { price: 900 },
  },
  "office-shirts": {
    "Formal Shirt": { price: 700 },
    "Semi-Formal Shirt": { price: 850 },
    "Custom Office Shirt": { price: 950 },
  },
  "custom-t-shirts": {
    "Cotton T-Shirt": { price: 500 },
    "Polyester T-Shirt": { price: 600 },
    "Custom Design T-Shirt": { price: 700 },
  },
  "custom-stamps-ink": {
    "Standard Stamp": { price: 200 },
    "Custom Stamp": { price: 300 },
    "Ink Bottle": { price: 100 },
  },
  "photo-gifts": {
    "Photo Mug": { price: 300 },
    "Photo Frame": { price: 400 },
    "Photo Keychain": { price: 250 },
  },
  "custom-caps": {
    "Baseball Cap": { price: 350 },
    "Snapback Cap": { price: 400 },
    "Custom Cap": { price: 450 },
  },
  "custom-drinkware": {
    "Custom Mug": { price: 350 },
    "Custom Bottle": { price: 400 },
    "Custom Travel Mug": { price: 450 },
  },
  "custom-bags": {
    "Tote Bag": { price: 400 },
    "Drawstring Bag": { price: 350 },
    "Customized Bag": { price: 500 },
  },
};

const AccessoryCategoryDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ get addToCart function
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAccessoryPrices, setSelectedAccessoryPrices] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/accessorycategories/accessory-printing`
        );
        setAccessories(response.data?.data?.subcategories || []);
        setCategoryDetails({
          description: response.data?.data?.description,
          image: response.data?.data?.image,
          name: response.data?.data?.name,
        });
        console.log(accessories)
        setLoading(false);
      } catch (err) {
        setError("Failed to load accessory category. Please try again later.");
        setLoading(false);
        console.error("Error fetching accessories:", err);
      }
    };

    fetchAccessories();
  }, []);

  const handleOrderNow = (accessoryId) => {
    const orderPath = `/order-page/accessory-printing?subcategory=${accessoryId}`;
    navigate(orderPath);
  };

  const handleShowPrices = (accessoryId) => {
    setSelectedAccessoryPrices(accessoryPriceData[accessoryId]);
  };

  const handleClosePrices = () => {
    setSelectedAccessoryPrices(null);
  };


  if (loading) return <AccessoryCategoryDetailsPlaceholder />;

  if (error)
    return (
      <div className="text-center text-red-500 text-xl mt-10 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-6 md:px-14  py-16">
      <BreadcrumbNavigation />
      {categoryDetails && (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-12">
          {/* Image Section */}
          <div className="md:w-1/3">
            <img
              src={categoryDetails.image}
              alt={categoryDetails.name}
              className="w-full rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
              {categoryDetails.name}
            </h2>
            <p className="text-blue-600 mb-6 leading-relaxed">
              Transform everyday items into unique expressions of your
              personality or brand.
            </p>

            <p className="text-lg font-semibold text-gray-700">
              Accessory Printing at Printzet:
            </p>
            <div className="ml-4 space-y-2 mt-2">
              <p className="text-sm text-gray-700">

                🧢 PrintZet brings your ideas to life with premium{" "}
                <strong>accessory printing</strong> — mugs, t-shirts, ID cards,
                and more, customized your way.
              </p>
              <p className="text-sm text-gray-700">
                🎨 Looking for the best{" "}
                <strong>custom accessory printing</strong>? PrintZet offers
                vibrant, durable prints on all types of products.
              </p>
              <p className="text-sm text-gray-700">
                🎁 With PrintZet’s expert{" "}
                <strong>accessory printing services</strong>, add a personal
                touch to gifts, merchandise, and promotional items.
              </p>
              <p className="text-sm text-gray-700">
                🖼️ Create personalized products with PrintZet’s high-quality{" "}
                <strong>online accessory printing</strong> — perfect for
                businesses, events, and personal use.
              </p>
              <p className="text-sm text-gray-700">
                🛍️ From custom mugs to professional ID cards, trust PrintZet for
                fast, affordable, and stunning{" "}
                <strong>accessory printing solutions</strong>.
              </p>

            </div>

            <p className="text-sm text-red-500 mt-4">
              * Click "Details" on a subcategory to view pricing information.
            </p>
          </div>
        </div>
      )}

      <div id="accessories" className="mt-10 md:mt-16 lg:mt-20">
        {accessories.length > 0 ? (
          <>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Explore Our <span className="text-blue-600">Accessories</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
              {accessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 md:h-52 lg:h-56">
                    <img
                      src={accessory.image}
                      alt={accessory.name}
                      className="w-full h-full object-contain rounded-t-lg "
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                      {accessory.name}
                    </h3>
                    {accessory.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {accessory.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                      {/* Details Button */}
                      <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-full transition"
                        onClick={() => handleShowPrices(accessory.id)}
                      >
                        Details
                      </button>

                      {/* Buy Now Button */}
                      <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
                        onClick={() => handleOrderNow(accessory.id)}
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
            <p>No accessories available at the moment.</p>
          </div>
        )}
      </div>

      {/* Price Details Modal */}
      {selectedAccessoryPrices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4">Price Details</h3>
            <ScrollArea className="h-96 w-full rounded-md border">
              <div className="p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Item</th>
                      <th className="py-2 px-4 border-b text-left">
                        Price (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedAccessoryPrices || {}).map(
                      ([item, details]) => (
                        <tr key={item}>
                          <td className="py-2 px-4 border-b text-left">
                            {item}
                          </td>
                          <td className="py-2 px-4 border-b text-left">
                            {details.price}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg font-semibold text-blue-600 hover:bg-gray-300"
                onClick={handleClosePrices}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-100 to-blue-400 p-8 rounded-lg border border-gray-300 text-gray-800 text-center">
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">
          Bulk Ordering Options
        </h3>
        <p className="text-lg">
          We offer bulk ordering options for businesses & institutions.
        </p>
        <p className="mt-4 text-xl font-medium">
          Send your requirements and inquiries to:
        </p>
        <p className="font-medium mt-2">
          📧{" "}
          <a
            href="mailto:info@printzet.com"
            className="text-blue-600 hover:underline"
          >
            info@printzet.com
          </a>
        </p>
        <p className="font-medium">
          📱{" "}
          <a
            href="https://wa.me/9395947730"
            className="text-green-600 hover:underline"
          >
            +91 9395947730
          </a>
        </p>
      </div>
    </div>
  );
};

export default AccessoryCategoryDetails;
