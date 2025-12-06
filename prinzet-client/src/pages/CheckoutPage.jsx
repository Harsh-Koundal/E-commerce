import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import query from "india-pincode-search";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import api from "@/lib/api";
import InvoiceSummary from "@/components/Orders/Confirmations";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(false);
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
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch user's saved address on component mount
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data?.data) {
          const userData = response.data.data;
          setCustomer((prev) => ({
            ...prev,
            name: userData.fullName || "",
            email: userData.email || "",
            phone: userData.mobile || "",
            address: userData.address[0]?.address || "",
            city: userData.address[0]?.city || "",
            state: userData.address[0]?.state || "",
            pincode: userData.address[0]?.pincode || "",
          }));
        }
      } catch (err) {
        console.error("No saved address found or error fetching address:", err);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchUserAddress();
  }, []);

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
        setCustomer((prev) => ({
          ...prev,
          pincode,
          city: details[0].district || details[0].city,
          state: details[0].state,
        }));
        // Fetch vendors for this pincode
        fetchVendors(pincode);
      } else {
        toast.error("Invalid pincode. Please enter a valid Indian pincode.");
        setSelectedVendor(null);
      }
    }
  };

  const fetchVendors = async (pincode) => {
    setLoadingVendors(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/vendors?pincode=${pincode}`
      );
      if (response.data?.data?.vendors?.length > 0) {
        setSelectedVendor(response.data.data.vendors[0]);
      } else {
        toast.warn("No vendor found for this pincode.");
        setSelectedVendor(null);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again.");
      setSelectedVendor(null);
    } finally {
      setLoadingVendors(false);
    }
  };

  // const placeOrder = async () => {
  //   if (!selectedVendor) {
  //     setError("Please select a valid pincode with available vendors.");
  //     toast.error("No vendor available for this location.");
  //     return;
  //   }

  //   setLoadingPayment(true);
  //   setError(null);

  //   try {
  //     const formData = new FormData();

  //     for (const key in order) {
  //       if (key === "files" && Array.isArray(order.files)) {
  //         order.files.forEach(file => formData.append("files", file.file || file));
  //       } else {
  //         formData.append(key, order[key]);
  //       }
  //     }


  //     for (const key in customer) {
  //       formData.append(`customerDetails[${key}]`, customer[key]);
  //     }

  //     // Add vendor ID
  //     formData.append("vendorId", selectedVendor._id);

  //     const response = await api.post("/order/place-order", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.data?.data?.url) {
  //       setOrderPlaced(true);
  //       window.location.href = response.data.data.url;
  //     } else {
  //       toast.error("Failed to initiate payment.");
  //     }
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.data?.message ||
  //       "An unexpected error occurred while placing the order";
  //     console.error("Error placing order:", message);
  //     setError(message);
  //     toast.error(message);
  //   } finally {
  //     setLoadingPayment(false);
  //   }
  // };
  const placeOrder = async () => {
  setLoadingPayment(true);
  setError(null);

  try {
    const formData = new FormData();

    Object.keys(order).forEach((key) => {
      if (key === "files") {
        order.files.forEach((fileObj, idx) => {
          formData.append(`orders[0][files][${idx}][url]`, fileObj.url);
          formData.append(`orders[0][files][${idx}][pageCount]`, fileObj.pageCount || 1);
          formData.append(`orders[0][files][${idx}][originalname]`, fileObj.name);
        });
      } else {
        formData.append(`orders[0][${key}]`, order[key]);
      }
    });

    Object.keys(customer).forEach((key) => {
      formData.append(`customerDetails[${key}]`, customer[key]);
    });

    const response = await api.post("/orders/place-order", formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const orderId = response.data?.data?.orders?.[0]?.orderId;
const paymentUrl = response.data?.data?.url;


if (orderId) {
  navigate("/confirm-order", {
  state: {
    orderId,
    order,
    customer,
    paymentUrl
  }
});

} else {
  toast.error("Order ID missing. Cannot continue.");
}


  } catch (error) {
    const message =
      error.response?.data?.data?.message ||
      "An unexpected error occurred while placing the order";

    console.error("Error placing order:", message);
    setError(message);
    toast.error(message);
  } finally {
    setLoadingPayment(false);
  }
};


  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        <p>No order details available. Please go back and try again.</p>
      </div>
    );
  }

  if (loadingAddress) {
    return (
      <div className="h-screen flex items-center justify-center">
        <BeatLoader color="#2563eb" size={12} />
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
          <p className="text-lg font-semibold text-gray-700">
            Total Cost:{" "}
            <span className="text-blue-600 font-bold">
              ₹
              {order.estimatedCost
                ? parseFloat(order.estimatedCost).toFixed(2)
                : "N/A"}
            </span>
          </p>
          <p className="text-gray-700">
            Copies:{" "}
            <span className="font-semibold">{order.numCopies}</span>
          </p>
          <p className="text-gray-700">
            Print Type:{" "}
            <span className="font-semibold">{order.colorType}</span>
          </p>
          {order.paperType && (
            <p className="text-gray-700">
              Paper Type:{" "}
              <span className="font-semibold">{order.paperType}</span>
            </p>
          )}
          {order.binding && (
            <p className="text-gray-700">
              Binding:{" "}
              <span className="font-semibold">{order.binding}</span>
            </p>
          )}
          {order.lamination && (
            <p className="text-gray-700">
              Lamination:{" "}
              <span className="font-semibold">{order.lamination}</span>
            </p>
          )}
          {order.printedSides && (
            <p className="text-gray-700">
              Printed Sides:{" "}
              <span className="font-semibold">{order.printedSides}</span>
            </p>
          )}
          <p className="text-gray-700">
            Total Pages:{" "}
            <span className="font-semibold">{order.totalPages}</span>
          </p>
          {order.files && order.files.length > 0 && (
            <div>
              <p className="text-gray-700 mt-2">Files:</p>
              <ul className="list-disc pl-5">
                {order.files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Shipping Details */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Shipping Details
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loadingVendors && (
            <p className="text-blue-500 mb-4">Finding vendors...</p>
          )}
          {selectedVendor && (
            <p className="text-green-600 mb-4 font-semibold">
              ✓ Vendor selected for your area
            </p>
          )}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={customer.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customer.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customer.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <PhoneInput
              country={"in"}
              onlyCountries={["in"]}
              value={customer.phone}
              onChange={handlePhoneChange}
              inputProps={{ name: "phone", required: true }}
              containerClass="w-full"
              inputClass="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

<div className="p-6">
  <button
    onClick={placeOrder}
    disabled={loadingPayment || !order?.files?.length || loadingVendors}
    className="mt-6 w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default CheckoutPage;