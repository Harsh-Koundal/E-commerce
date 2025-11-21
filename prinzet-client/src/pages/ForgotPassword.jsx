import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Forgot Password Response:", res.data);
      setMessage(res.data.message || "Password reset link sent!");
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <p className="text-gray-600 mb-4">
        Enter your email to receive a password reset link. 
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleForgotPassword}
        className="w-full bg-blue-500 text-white p-2 rounded mt-3 hover:bg-blue-600"
      >
        Send Reset Link
      </button>

      {message && <p className="mt-3 text-green-500">{message}</p>}
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
