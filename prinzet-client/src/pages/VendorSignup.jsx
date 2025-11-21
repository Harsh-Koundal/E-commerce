import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VendorSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    pressName: "",
    address: "",
    serviceablePincodes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pincodesArray = form.serviceablePincodes
        .split(",")
        .map((pin) => pin.trim());

      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/auth/signup`, {
        ...form,
        serviceablePincodes: pincodesArray,
      });

      setMessage("Signup successful! Please check your email to verify your account.");
      setError("");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        pressName: "",
        address: "",
        serviceablePincodes: "",
      });
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Vendor signup failed. Please try again.");
      setError(err.response?.data?.message || "Vendor signup failed.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center py-10 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center">Vendor Sign Up</h2>
        {message && (
          <div className="text-green-600 text-center mt-2">{message}</div>
        )}
        {error && (
          <div className="text-red-600 text-center mt-2">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="text"
            name="pressName"
            placeholder="Printing Press Name"
            value={form.pressName}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="text"
            name="serviceablePincodes"
            placeholder="Serviceable Pincodes (comma-separated)"
            value={form.serviceablePincodes}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mt-4"
          >
            Register as Vendor
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have a vendor account?{" "}
          <Link to="/vendor-login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorSignup;
