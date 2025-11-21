import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { logoImg } from "@/assets";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup, googleSignUp, loading } = useAuth();
  const [userData, setUserData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Google OAuth2 login handler using auth code floww
  const googleSignupHandler = useGoogleLogin({
    onSuccess: async (authResult) => {
      if (authResult?.code) {
        try {
          await googleSignUp(authResult.code);
        } catch (err) {
          console.error("Google Sign Up Error:", err);
          toast.error("Google sign up failed!");
        }
      }
    },
    onError: (err) => {
      console.error("Google Login Error:", err);
      toast.error("Google login failed!");
    },
    flow: "auth-code",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await signup({
        fullName: userData.fullName,
        mobile: userData.mobile,
        email: userData.email,
        password: userData.password,
      });
      // Navigation handled inside AuthContext
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-[900px] bg-white shadow-lg rounded-xl overflow-hidden border m-5">
        {/* Left Side - Welcome Back */}
        <div className="w-1/2 bg-rose-300 flex flex-col justify-center items-center text-center p-10 relative">
          <h2 className="text-white text-3xl font-bold mb-4">WELCOME BACK!</h2>
          <p className="text-white text-medium mb-6">
            Stay connected with us
            <span className="flex text-sm">log in with your personal info.</span>
          </p>
          <Link
            to="/login"
            className="bg-white/80 text-rose-600 py-3 px-6 rounded-full w-1/2 shadow-md hover:bg-white bg-rose-200 border-2 font-medium"
          >
            Login
          </Link>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-1/2 bg-blue-50 p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logoImg} alt="Printzet Logo" className="w-28" />
          </div>

          <h2 className="text-gray-700 text-3xl font-bold text-center mb-4">
            Create Account
          </h2>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full hover:bg-gray-100"
              onClick={googleSignupHandler}
              type="button"
              aria-label="Sign up with Google"
            >
              <i className="fab fa-google text-gray-600"></i>
            </button>

            <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full hover:bg-gray-100" type="button" aria-label="Sign up with Facebook">
              <i className="fab fa-facebook-f text-gray-600 text-sm"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full hover:bg-gray-100" type="button" aria-label="Sign up with LinkedIn">
              <i className="fab fa-linkedin-in text-gray-600 text-sm"></i>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={userData.fullName}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile No."
              value={userData.mobile}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
              required
            />
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="w-1/2 bg-sky-500 text-white py-3 rounded-3xl font-semibold hover:bg-sky-600 shadow-md transition-all"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;