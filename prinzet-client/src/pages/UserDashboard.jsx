import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FiGrid, FiUser, FiFileText, FiMessageCircle, FiSettings, FiMail, FiPhone, FiMapPin, FiSave, FiLock, FiCheckCircle, FiPackage, } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  Edit3,
  Eye,
  Trash2,
  RotateCcw,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { getData, postData, updateData } from "@/lib/api";


const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`DELETE ${endpoint} error:`, error);
    throw error;
  }
};

const UserDashboard = () => {
const [activePage, setActivePage] = useState(() => {
  return localStorage.getItem("activePage") || "profile";
});

useEffect(() => {
  localStorage.setItem("activePage", activePage);
}, [activePage]);

  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const gradient = `linear-gradient(to bottom,
    #FF0097 0%,
    #E900A1 21%,
    #E100A5 38%,
    #DB00A7 50%,
    #C500B2 60%,
    #B400B9 71%,
    #A600BF 84%,
    #9500C7 100%
  )`;

  const [user, setUser] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customizingOrder, setCustomizingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customOptions, setCustomOptions] = useState({});
  const [trackingOrder, setTrackingOrder] = useState(null);
  const orderStatus = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ]


  const [addressList, setAddressList] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });


  const [supportText, setSupportText] = useState("");
  const [message, setMessage] = useState([]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser({});
      setEditData({ fullName: "", email: "", password: "", mobile: "" });
      setOrders([]);
      setAddressList([]);
      setSelectedOrder(null);
      setCustomizingOrder(null);
      setActivePage("profile");
      setSupportText("");
      setNewAddress({ address: "", city: "", state: "", pincode: "" });
      setEditingProfile(false);

      logout();

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);

      navigate("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getData("/auth/user/profile");

        if (!profileData || !profileData.email) {
          console.error("Invalid profile data received:", profileData);
          toast.error("Failed to load profile. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUser({
          name: profileData.fullName || "User",
          email: profileData.email,
          password: "",
          mobile: profileData.mobile || "",
        });

        setEditData({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          mobile: profileData.mobile || "",
          password: "",
        });

        console.log("Profile loaded successfully:", {
          name: profileData.fullName,
          email: profileData.email,
          mobile: profileData.mobile,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error("User profile not found.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error("Failed to load profile. Please try again.");
        }

      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("orders :", res.data)
        const ordersArray = res.data?.data || [];
        setOrders(ordersArray);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data?.data || error.message
        );

        setOrders([]);
      }
    };

    fetchOrders();
  }, []);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getData("/auth/user/address");
        console.log("Raw address response:", res);

        // Handle different response structures from backend
        let addresses = [];
        if (Array.isArray(res)) {
          addresses = res;
        } else if (res && Array.isArray(res.data)) {
          addresses = res.data;
        } else if (res && res.address && Array.isArray(res.address)) {
          addresses = res.address;
        }

        setAddressList(addresses);
        console.log("Addresses set to:", addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);

        // Handle 404 as no addresses found (not an error)
        if (error.response?.status === 404) {
          setAddressList([]);
          console.log("No addresses found for user");
        } else {
          toast.error("Failed to load addresses");
          setAddressList([]);
        }
      }
    };

    fetchAddresses();
  }, []);


  // Profile update handler with comprehensive validation
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!editData.fullName?.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (
      editData.mobile &&
      !/^\d{10}$/.test(editData.mobile.replace(/\D/g, ""))
    ) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const updatePayload = {
        fullName: editData.fullName.trim(),
        mobile: editData.mobile?.trim() || "",
      };

      console.log("Updating profile with:", updatePayload);
      const updatedUser = await updateData("/auth/user/profile", updatePayload);

      toast.success("Profile updated successfully!");

      setUser({
        name: updatedUser.fullName || editData.fullName,
        email: user.email,
        mobile: updatedUser.mobile || editData.mobile,
        id: user.id,
      });

      setEditingProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid input data");
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  // Enhanced address handlers with better UX
  const handleAddAddress = async () => {
    const { address, city, state, pincode } = newAddress;

    if (!address?.trim()) {
      toast.warning("Address is required");
      return;
    }
    if (!city?.trim()) {
      toast.warning("City is required");
      return;
    }
    if (!state?.trim()) {
      toast.warning("State is required");
      return;
    }
    if (!pincode?.trim()) {
      toast.warning("Pincode is required");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.warning("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      const addressPayload = {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      };

      console.log("Adding address:", addressPayload);
      await postData("/auth/user/address", addressPayload);
      toast.success("Address added successfully!");

      // Refresh address list
      try {
        const updatedAddresses = await getData("/auth/user/address");
        let addresses = [];
        if (Array.isArray(updatedAddresses)) {
          addresses = updatedAddresses;
        } else if (
          updatedAddresses?.data &&
          Array.isArray(updatedAddresses.data)
        ) {
          addresses = updatedAddresses.data;
        } else if (
          updatedAddresses?.address &&
          Array.isArray(updatedAddresses.address)
        ) {
          addresses = updatedAddresses.address;
        }
        setAddressList(addresses);
      } catch (fetchError) {
        console.error("Error fetching updated addresses:", fetchError);
      }

      setNewAddress({ address: "", city: "", state: "", pincode: "" });
    } catch (error) {
      console.error("Error adding address:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid address data");
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to add address. Please try again.");
      }
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await updateData("/auth/user/profile", editData);
      toast.success("Profile updated successfully!");
      setUser({
        name: editData.fullName,
        email: editData.email,
        password: editData.password,
        mobile: editData.mobile,
      });
      setEditingProfile(false);
    } catch (error) {
      console.error("Error deleting address:", error);

      if (error.response?.status === 404) {
        toast.error("Address not found or already deleted");

        try {
          const updatedAddresses = await getData("/auth/user/address");
          setAddressList(
            Array.isArray(updatedAddresses) ? updatedAddresses : []
          );
        } catch (fetchError) {
          console.error("Error refreshing addresses:", fetchError);
        }
      } else {
        toast.error("Failed to remove address. Please try again.");
      }
    }
  };

  // Order actions

  const handleReorder = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    confirmCustomOrder(order._id);
  };


  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
    toast.success("Order deleted successfully!");
  };

  const handleSupportSubmit = async () => {
    if (!supportText.trim()) {
      toast.warning("Please enter a message");
      return;
    }

    try {
      console.log("Support message:", {
        userId: user.id,
        message: supportText.trim(),
        timestamp: new Date().toISOString(),
      });

      toast.success(
        "Support message sent successfully! We'll get back to you soon."
      );
      setSupportText("");
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Failed to send message. Please try again.");
    }

  };

  const renderProfile = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-pink-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-1">
            Profile Information
          </h2>
          <p className="text-gray-600 text-sm">Manage your personal details</p>
        </div>
        <motion.button
          onClick={() => setEditingProfile(!editingProfile)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editingProfile ? <X size={18} /> : <Edit3 size={18} />}
          {editingProfile ? "Cancel" : "Edit Profile"}
        </motion.button>
      </div>

      {editingProfile ? (
        <motion.form
          onSubmit={handleProfileUpdate}
          className="space-y-5 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={editData.mobile || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, mobile: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSave size={18} />
            Save Changes
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-pink-200">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-pink-100">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-purple-50 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {user?.name || "User"}
              </h3>
              <p className="text-gray-600">{user?.email || "No email"}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white/60 backdrop-blur-sm border border-pink-200 rounded-2xl p-5 hover:border-pink-400 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="text-gray-800 font-medium truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white/60 backdrop-blur-sm border border-pink-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Mobile Number
                  </p>
                  <p className="text-gray-800 font-medium">
                    {user?.mobile || "Not provided"}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white/60 backdrop-blur-sm border border-pink-200 rounded-2xl p-5 hover:border-pink-400 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiLock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Password
                  </p>
                  <p className="text-gray-800 font-medium">••••••••</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white/60 backdrop-blur-sm border border-pink-200 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Address
                  </p>
                  {addressList.length > 0 ? (
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {addressList[addressList.length - 1].address}, {addressList[addressList.length - 1].city},{" "}
                      {addressList[addressList.length - 1].state} - {addressList[addressList.length - 1].pincode}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">No address added</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl shadow-xl p-6 border border-purple-200">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-8 text-center sm:text-left">
        My Orders
      </h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-purple-200 rounded-2xl p-5 bg-white/90 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Order #{order.orderId}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>

                    <button
                      className="px-5 py-3 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition cursor-pointer"
                      onClick={() =>
                        setTrackingOrder(
                          trackingOrder === order._id ? null : order._id
                        )
                      }
                    >
                      {trackingOrder === order._id
                        ? "Hide Tracking"
                        : "Track Order"}
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base">
                    {order.items && Array.isArray(order.items) && order.items.length > 0
                      ? order.items.map((i) => i.name || i).join(", ")
                      : order.subCategory || "Custom Print Order"}
                  </p>

                  <p className="font-bold text-gray-700 text-sm sm:text-base">
                    Order Date:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>

                  <p className="font-bold text-gray-700 text-sm sm:text-base">
                    Total: ₹{order.totalCost?.toFixed(2) || 0}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center sm:justify-end mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order.id ? null : order.id
                      )

                    }
                    className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition shadow-sm flex items-center justify-center w-10 h-10"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleReorder(order._id)}
                    className="p-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition shadow-sm flex items-center justify-center w-10 h-10"
                    title="Reorder"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm flex items-center justify-center w-10 h-10"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order._id && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-gray-700 text-sm sm:text-base">
                    <p><strong>Copies:</strong> {order.numCopies}</p>
                    <p><strong>Paper Type:</strong> {order.paperType}</p>
                    <p><strong>Print Quality:</strong> {order.printQuality}</p>
                    <p><strong>Binding:</strong> {order.binding}</p>
                    <p><strong>Lamination:</strong> {order.lamination}</p>
                    <p><strong>Printed Sides:</strong> {order.printedSides}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Transaction:</strong> {order.transactionId}</p>
                  </div>
                </div>
              )}

              {/* Track Order */}
              {trackingOrder === order._id && (
                <motion.div
                  className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-inner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-bold text-gray-800 mb-4">Order Tracking</h4>
                  <ul className="relative border-l-2 border-gray-300 ml-4">
                    {orderStatus.map((step, idx) => {
                      const completed =
                        order.status === "completed" ||
                        (order.status === "pending" && idx < 2);
                      return (
                        <motion.li
                          key={idx}
                          className="mb-6 ml-4"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <span
                            className={`absolute -left-4 w-8 h-8 flex items-center justify-center rounded-full text-white ${completed ? "bg-green-500" : "bg-gray-400"
                              }`}
                          >
                            {completed ? <FiCheckCircle size={13} /> : <FiPackage size={13} />}
                          </span>
                          <h3
                            className={`font-semibold pl-1.5 ${completed ? "text-gray-800" : "text-gray-500"
                              }`}
                          >
                            {step}
                          </h3>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No orders found</p>
        </div>
      )}
    </div>
  );


  const renderReorders = () => (
    <div className="bg-gradient-to-r from-pink-100 to-purple-50 rounded-2xl shadow-lg p-6 border border-pink-100">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
        Re-orders with Customization
      </h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders
          .filter((o) => o.status?.toLowerCase() === "completed")
          .map((order) => (
            <div
              key={order._id}
              className="border border-pink-100 rounded-2xl p-5 mb-4 bg-white/90 shadow-sm hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p>
                    {order.items && Array.isArray(order.items)
                      ? order.items.map((i) => i.name || i).join(", ")
                      : "No items"}

                  </p>
                </div>
                <button
                  onClick={() => setCustomizingOrder(order._id)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  <Edit3 size={16} /> Customize
                </button>
              </div>
              {/* Customization Section */}
              {customizingOrder === order._id && (
                <div className="mt-4 p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 shadow-sm">
                  <h4 className="font-semibold mb-3">Customize Your Order:</h4>
                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-500 border-purple-300 rounded focus:ring-purple-400"
                        checked={customOptions[order._id]?.extraPages || false}
                        onChange={() =>
                          handleOptionChange(order._id, "extraPages")
                        }
                      />
                      <span>Extra Pages (+₹20)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-500 border-purple-300 rounded focus:ring-purple-400"
                        checked={customOptions[order._id]?.glossyDesigns || false}
                        onChange={() =>
                          handleOptionChange(order._id, "glossyDesigns")
                        }
                      />
                      <span>Glossy Designs (+₹15)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-500 border-purple-300 rounded focus:ring-purple-400"
                        checked={customOptions[order._id]?.printQuality || false}
                        onChange={() =>
                          handleOptionChange(order._id, "printQuality")
                        }
                      />
                      <span>Premium Print Quality (+₹30)</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmCustomOrder(order._id)}
                      disabled={loading}
                      className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-md hover:opacity-90 hover:shadow-lg transition"
                    >
                      {loading ? "Placing..." : "Confirm Order"}
                    </button>
                    <button
                      onClick={() => setCustomizingOrder(null)}
                      className="flex-1 px-1 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-300 text-gray-700 font-medium shadow-sm hover:shadow-md hover:opacity-90 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiGrid className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No completed orders available for re-ordering</p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-pink-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
          Settings
        </h2>
        <div className="mb-6 bg-white/80 border border-pink-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Address</h3>
          {addressList.length > 0 ? (
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg bg-gray-50">
                {addressList[addressList.length - 1].address}, {addressList[addressList.length - 1].city}, {addressList[addressList.length - 1].state} - {addressList[addressList.length - 1].pincode}

              </li>
            </ul>
          ) : (
            <p className="text-gray-500 mb-4">No addresses added yet.</p>
          )}

          {/* Add New Address Form */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Add New Address</h4>
            <input
              type="text"
              placeholder="Address"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
              className="w-full border border-pink-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="border border-pink-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="border border-pink-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Pincode (6 digits)"
                value={newAddress.pincode}
                onChange={(e) => {
                  // Only allow digits and limit to 6 characters
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setNewAddress({ ...newAddress, pincode: value });
                }}
                className="border border-pink-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
                maxLength="6"
              />
            </div>
            <button
              onClick={handleAddAddress}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow hover:opacity-90 transition font-medium"
            >
              Chnage Address
            </button>
          </div>
        </div>

        {/* Change Password*/}
        <div className="text-right mt-2">
          <button
            onClick={() => {
              window.location.href = "/forgot-password";
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200"
          >
            Reset Password
          </button>
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={() => {
              handleLogout();
              toast.success("Logged out successfully!");
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow transition font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    );
  };

  const renderSupport = () => (
    <div className="bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-pink-100">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
        Support / Chat
      </h2>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {message.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          message.map((msg) => (
            <div
              key={msg._id}
              className="p-3 rounded-xl bg-white/90 border border-pink-100 shadow-sm"
            >
              <p className="font-medium text-pink-600">{msg.subject}</p>
              <p className="text-gray-700">{msg.message}</p>
              <span className="text-xs text-gray-400">{msg.status}</span>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="space-y-4">
        <textarea
          value={supportText}
          onChange={(e) => setSupportText(e.target.value)}
          className="w-full border border-pink-200 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 transition resize-none"
          rows={4}
          placeholder="Type your message or describe your issue..."
        />
        <button
          onClick={handleSupportSubmit}
          className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition"
        >
          Send Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className="fixed bottom-0 w-full md:static md:w-64 flex md:flex-col md:h-full 
        bg-gradient-to-b text-white shadow-xl  
        rounded-t-2xl md:rounded-none z-30 overflow-hidden"
        style={{ background: gradient }}
      >
        <nav className="flex justify-around md:flex-col w-full mt-3">
          <button
            onClick={() => setActivePage("profile")}
            className={`flex items-center justify-center md:justify-start px-6 py-3 rounded-xl transition-all duration-200 ${activePage === "profile"
              ? "bg-white/20 shadow-md"
              : "hover:bg-white/10"
              }`}
          >
            <FiUser className="w-5 h-5 mr-0 md:mr-3" />
            <span className="hidden md:inline">Profile</span>
          </button>
          <button
            onClick={() => setActivePage("orders")}
            className={`flex items-center justify-center md:justify-start px-6 py-3 rounded-xl transition-all duration-200 ${
              activePage === "orders" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FiFileText className="w-5 h-5 mr-0 md:mr-3" />
            <span className="hidden md:inline">Orders</span>
          </button>
          <button
            onClick={() => setActivePage("reorders")}
            className={`flex items-center justify-center md:justify-start px-6 py-3 rounded-xl transition-all duration-200 ${
              activePage === "reorders" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FiGrid className="w-5 h-5 mr-0 md:mr-3" />
            <span className="hidden md:inline">Re-orders</span>
          </button>
          <button
            onClick={() => setActivePage("settings")}
            className={`flex items-center justify-center md:justify-start px-6 py-3 rounded-xl transition-all duration-200 ${
              activePage === "settings" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FiSettings className="w-5 h-5 mr-0 md:mr-3" />
            <span className="hidden md:inline">Settings</span>
          </button>
          <button
            onClick={() => setActivePage("support")}
            className={`flex items-center justify-center md:justify-start px-6 py-3 rounded-xl transition-all duration-200 ${
              activePage === "support" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <FiMessageCircle className="w-5 h-5 mr-0 md:mr-3" />
            <span className="hidden md:inline">Support</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50 pb-20 md:pb-8">
        {activePage === "profile" && renderProfile()}
        {activePage === "orders" && renderOrders()}
        {activePage === "reorders" && renderReorders()}
        {activePage === "settings" && renderSettings()}
        {activePage === "support" && renderSupport()}
      </div>
    </div>
  );
};

export default UserDashboard;