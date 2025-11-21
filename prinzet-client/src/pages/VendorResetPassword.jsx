import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const VendorResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("🔹 Vendor Reset Token:", token);
  }, [token]);

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.info("Please enter a new password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/reset-password/${token}`,
        { newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(res.data.message || "Password reset successful!");
      navigate("/vendor/login");
    } catch (error) {
      console.error("❌ Vendor Reset Error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Vendor Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded mb-3"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handleResetPassword}
        className={`w-full p-2 rounded mt-3 text-white ${
          isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Reset Password"}
      </button>
    </div>
  );
};

export default VendorResetPassword;
