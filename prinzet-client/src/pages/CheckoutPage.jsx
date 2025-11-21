import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import query from "india-pincode-search";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import api from "@/lib/api";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = location.state || {};
  // console.log(orders)
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
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loadingVendors, setLoadingVendors] = useState(false);

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


        // fetchVendors(pincode);
      } else {
        toast.error("Invalid pincode. Please enter a valid Indian pincode.");
      }
    }
  };

  const fetchVendors = async (pincode) => {
    setLoadingVendors(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/vendors?pincode=${pincode}`
      );
      if (response.data.data.vendors.length > 0) {
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
  const totalPaidAmount = orders.reduce(
    (sum, item) => sum + (item?.estimatedCost || item?.totalCost || 0),
    0
  );

  // const placeOrder = async () => {
  //   console.log("Placing order with details:", { orders, customer, selectedVendor });
  //   setLoadingPayment(true);
  //   setError(null);

  //   // if (!selectedVendor) {
  //   //   setError("No vendor available for the selected pincode.");
  //   //   toast.error("No vendor available for the selected pincode.");
  //   //   setLoadingPayment(false);
  //   //   return;
  //   // }

  //   try {
  //     const formData = new FormData();
  //     for (const key in orders) {
  //       if (key === "files" && Array.isArray(orders.files)) {
  //         orders.files.forEach((file) => formData.append("files", file));
  //       } else {
  //         formData.append(key, orders[key]);
  //       }
  //     }
  //     for (const key in customer) {
  //       formData.append(`customerDetails[${key}]`, customer[key]);
  //     }
  //     // formData.append("vendorId", selectedVendor._id);
  //     console.log("Form Data Entries:", formData);
  //     const response = await api.post("/orders/place-order", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     console.log("Order Response:", response.data);

  //     if (response.data?.data?.url) {
  //       window.location.href = response.data.data.url;
  //     } else {
  //       toast.error("Failed to initiate payment.");
  //     }
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.data?.message ||
  //       "An unexpected error occurred while placing the order";
  //     console.error("Error placing order:", message, error.response?.data.data || error);
  //     setError(message);
  //     toast.error(message);
  //   } finally {
  //     setLoadingPayment(false);
  //   }
  // };
  const placeOrder = async () => {
    console.log("Placing order with details:", { orders, customer, selectedVendor });
    setLoadingPayment(true);
    setError(null);

    try {
      const payload = {
        orders: [...orders],
        customerDetails: customer,
        vendorId: selectedVendor?._id || null
      };

      console.log("Order Payload:", payload);

      const response = await api.post("/orders/place-order", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Order Response:", response.data);

      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (error) {
      const message =
        error.response?.data?.data?.message ||
        "An unexpected error occurred while placing the order";
      console.error("Error placing order:", message, error.response?.data?.data || error);
      setError(message);
      toast.error(message);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!orders) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700">
        <p>No order details available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-xl p-8">
        {/* Order Summary */}
        {/* <div className="border p-6 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Order Summary</h2>
          <p className="text-lg font-semibold text-gray-700">
            Total Cost:{" "}
            <span className="text-blue-600 font-bold">
              ₹
              {orders.estimatedCost
                ? parseFloat(orders.estimatedCost).toFixed(2)
                : "N/A"}
            </span>
          </p>
          <p className="text-gray-700">
            Copies: <span className="font-semibold">{orders.numCopies}</span>
          </p>
          <p className="text-gray-700">
            Print Type: <span className="font-semibold">{orders.colorType}</span>
          </p>
          {orders.paperType && (
            <p className="text-gray-700">
              Paper Type:{" "}
              <span className="font-semibold">{orders.paperType}</span>
            </p>
          )}
          {orders.binding && (
            <p className="text-gray-700">
              Binding: <span className="font-semibold">{orders.binding}</span>
            </p>
          )}
          {orders.lamination && (
            <p className="text-gray-700">
              Lamination:{" "}
              <span className="font-semibold">{orders.lamination}</span>
            </p>
          )}
          {orders.printedSides && (
            <p className="text-gray-700">
              Printed Sides:{" "}
              <span className="font-semibold">{orders.printedSides}</span>
            </p>
          )}
          <p className="text-gray-700">
            Total Pages: <span className="font-semibold">{orders.totalPages}</span>
          </p>
          {orders.files && orders.files.length > 0 && (
            <div>
              <p className="text-gray-700 mt-2">Files:</p>
              <ul className="list-disc pl-5">
                {orders.files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div> */}
        {/* Order Summary */}
        <div className="border p-6 rounded-lg shadow-md bg-blue-50">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Order Summary</h2>
          <div>
            <p className="text-lg font-bold text-gray-700">Total Cost: {totalPaidAmount.toFixed(2)}</p>
          </div>
          {orders?.length > 0 && orders?.map((item, index) => (
            <div key={item.id || index} className="mb-6 border-b pb-4 last:border-none">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Product {index + 1}: {item?.name}
              </h3>

              <p className="text-gray-700">
                Cost:
                <span className="text-blue-600 font-bold">
                  ₹{item?.estimatedCost?.toFixed(2) || item?.totalCost?.toFixed(2)}
                </span>
              </p>

              <p className="text-gray-700">
                Copies: <span className="font-semibold">{item?.numCopies}</span>
              </p>

              {item.paperType && (
                <p className="text-gray-700">
                  Paper Type: <span className="font-semibold">{item?.paperType}</span>
                </p>
              )}

              {item.binding && (
                <p className="text-gray-700">
                  Binding: <span className="font-semibold">{item?.binding}</span>
                </p>
              )}
              <p className="text-gray-700">
                Print Type: <span className="font-semibold">{item?.colorType || "None"}</span>
              </p>
              {item.lamination && (
                <p className="text-gray-700">
                  Lamination: <span className="font-semibold">{item?.lamination}</span>
                </p>
              )}

              {item.printedSides && (
                <p className="text-gray-700">
                  Printed Sides: <span className="font-semibold">{item?.printedSides}</span>
                </p>
              )}

              <p className="text-gray-700">
                Total Pages: <span className="font-semibold">{item?.totalPages}</span>
              </p>

              {item.files && item.files.length > 0 && (
                <div>
                  <p className="text-gray-700 mt-2">Uploaded Document:</p>
                  <ul className="list-disc pl-5">
                    {item.files.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {file.name || file.originalname}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>


        {/* Shipping Details */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Details</h2>
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

          <button
            onClick={placeOrder}
            disabled={ loadingPayment || !orders.some(order => order.files && order.files.length > 0)}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {loadingPayment ? <BeatLoader color="white" size={8} /> : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
