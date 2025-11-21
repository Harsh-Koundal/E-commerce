import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const VendorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.info("Please enter your registered email.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Forgot Password Response:", res.data.message);
      toast.success(res.data.message || "Password reset email sent.");
    } catch (error) {
      console.error("❌ Forgot Password Error:", error);
      toast.error(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Vendor Forgot Password</h2>
      <input
        type="email"
        placeholder="Registered Email"
        className="w-full p-2 border rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleForgotPassword}
        className={`w-full p-2 rounded mt-3 text-white ${
          isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
};

export default VendorForgotPassword;
