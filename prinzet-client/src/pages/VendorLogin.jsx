import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VendorLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/auth/login`,
        form
      );
      const { token, vendor } = res.data.data;

      localStorage.setItem("vendorToken", token);
      localStorage.setItem("vendorInfo", JSON.stringify(vendor));

      console.log("Login successful:", res.data.data);
      toast.success("Login successful!");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 mb-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Vendor Login</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded mb-3"
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-1"
        name="password"
        value={form.password}
        onChange={handleChange}
      />

      {/* Forgot Password Link */}
      <div className="text-left mb-3">
        <Link
          to="/vendor-forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        className="w-full bg-blue-500 text-white p-2 rounded mt-3 hover:bg-blue-600 flex justify-center"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          "Login"
        )}
      </button>

      <p className="text-sm mt-3 text-center">
        Not a vendor yet?{" "}
        <Link to="/vendor-signup" className="text-green-500">
          Sign Up
        </Link>
      </p>
      <p className="text-sm text-center mt-4">
        Are you a user?{" "}
        <Link to="/login" className="text-blue-600">
          Login Here
        </Link>
      </p>
    </div>
  );
};

export default VendorLogin;
