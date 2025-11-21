import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("🔹 Token from URL:", token); // Debugging
  }, [token]);

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/reset-password`,
        { token, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(res.data.message || "Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
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

export default ResetPassword;
