import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import query from "india-pincode-search";
import { BeatLoader } from "react-spinners";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const AccessoryCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};
  const { cart, addToCart, clearCart } = useCart(); // ✅ Context instead of localStorage

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loadingVendors, setLoadingVendors] = useState(false);

  // Load cart if no orderDetails
  const cartItems = orderDetails ? [] : cart;

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setCustomer({ ...customer, phone: value });
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setCustomer({ ...customer, pincode });

    if (pincode.length === 6) {
      const details = query.search(pincode);

      if (details && details.length > 0) {
        setCustomer({
          ...customer,
          pincode,
          city: details[0].district || details[0].city,
          state: details[0].state,
        });
      } else {
        toast.error("Invalid pincode. Please enter a valid Indian pincode.");
      }
    }
  };

  // fetch vendors based on pincode
  useEffect(() => {
    const fetchVendors = async (pincode) => {
      setLoadingVendors(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/vendors?pincode=${pincode}`
        );
        setVendors(response.data.vendors);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load vendors. Please try again.");
        setVendors([]);
      } finally {
        setLoadingVendors(false);
      }
    };

    if (customer.pincode.length === 6) {
      fetchVendors(customer.pincode);
    } else {
      setVendors([]);
    }
  }, [customer.pincode]);

  const handleAddToCart = () => {
    if (!orderDetails) return;

    addToCart({
      id: Date.now(),
      name: orderDetails.subCategory || "Accessory Item",
      quantity: orderDetails.numCopies || 1,
      price: orderDetails.estimatedCost || 0,
      image: orderDetails.previewImage || null,
    });

    alert("Item added to cart successfully!");
    navigate("/cart");
  };

  const placeOrder = async () => {
    setLoadingPayment(true);
    setError(null);

    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue checkout.");
      navigate("/login");
      setLoadingPayment(false);
      return;
    }

    if (!selectedVendor) {
      setError("Please select a vendor to proceed.");
      setLoadingPayment(false);
      return;
    }

    try {
      const formData = new FormData();

      if (orderDetails) {
        // Case 1: Single item checkout
        for (const key in orderDetails) {
          if (key === "files" && Array.isArray(orderDetails.files)) {
            orderDetails.files.forEach((file) =>
              formData.append("files", file)
            );
          } else if (orderDetails.hasOwnProperty(key)) {
            formData.append(key, orderDetails[key]);
          }
        }
      } else {
        // Case 2: Cart checkout
        formData.append("cart", JSON.stringify(cartItems));
      }

      // customer details
      for (const key in customer) {
        if (customer.hasOwnProperty(key)) {
          formData.append(`customerDetails[${key}]`, customer[key]);
        }
      }

      // vendor
      formData.append("vendorId", selectedVendor._id);

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/accessory-orders/place-order`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Accessory order placed successfully:", response.data.data);
      if (response.data?.data.url) {
        clearCart(); // ✅ Clear cart after successful order
        window.location.href = response.data.data.url; // redirect to PhonePe
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (error) {
      const message =
        error.response?.data?.data?.message ||
        "An unexpected error occurred while placing the order";
      console.error(
        "Error placing accessory order:",
        message,
        error.response?.data.data || error
      );
      setError(message);
      toast.errror(message);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!orderDetails && cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        <p>No order or cart details available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-xl p-8">
        {/* Order Summary */}
        <div className="border p-6 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Order Summary
          </h2>

          {orderDetails ? (
            <>
              <p className="text-lg font-semibold text-gray-700">
                Total Cost:{" "}
                <span className="text-blue-600 font-bold">
                  ₹
                  {orderDetails.estimatedCost
                    ? parseFloat(orderDetails.estimatedCost).toFixed(2)
                    : "N/A"}
                </span>
              </p>
              <p className="text-gray-700">
                Copies:{" "}
                <span className="font-semibold">{orderDetails.numCopies}</span>
              </p>
              <p className="text-gray-700">
                Subcategory:{" "}
                <span className="font-semibold">
                  {orderDetails.subCategory}
                </span>
              </p>

              {/* ✅ Big Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="mt-6 w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
              >
                Add to Cart
              </button>
            </>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping Details + Vendor Selection */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Shipping Details
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            {["name", "email", "address"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}

            <PhoneInput
              country={"in"}
              onlyCountries={["in"]}
              value={customer.phone}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={customer.pincode}
              onChange={handlePincodeChange}
              maxLength="6"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={customer.city}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={customer.state}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Vendor Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Select a Vendor:
            </h3>
            {loadingVendors ? (
              <div className="flex items-center justify-center py-2">
                <BeatLoader color="#2563eb" size={8} />
              </div>
            ) : vendors.length > 0 ? (
              <div className="space-y-2">
                {vendors.map((vendor) => (
                  <div
                    key={vendor._id}
                    className={`p-2 rounded-lg border cursor-pointer ${
                      selectedVendor?._id === vendor._id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    }`}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <h4 className="font-semibold text-gray-800">
                      {vendor.pressName}
                    </h4>
                    <p className="text-sm text-gray-600">{vendor.address}</p>
                    <p className="text-xs text-gray-500">
                      Email: {vendor.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No vendors found for this pincode. Please try another pincode.
              </p>
            )}
            {selectedVendor && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-md">
                <p className="text-green-700 text-sm">
                  Selected Vendor:{" "}
                  <span className="font-semibold">
                    {selectedVendor.pressName}
                  </span>
                </p>
              </div>
            )}
          </div>

          <button
            onClick={placeOrder}
            className={`mt-6 w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center ${
              loadingPayment ? "opacity-70 cursor-wait" : ""
            }`}
            disabled={
              loadingPayment ||
              !customer.name ||
              !customer.email ||
              !customer.phone ||
              !customer.address ||
              !customer.pincode ||
              customer.pincode.length !== 6 ||
              !selectedVendor ||
              (!orderDetails && cartItems.length === 0)
            }
          >
            {loadingPayment ? (
              <BeatLoader color="white" size={8} />
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessoryCheckoutPage;
