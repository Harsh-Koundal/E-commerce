import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged inn
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // clean corrupted value
    }
  }, []);

  // Normal login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await axios.post(
        ` ${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/login`,
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      const { user, token, message } = res.data.data;
      const userData = { ...user, isAdmin: user.isAdmin || false };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      toast.success(message || "Login successful!");
      navigate(userData.isAdmin ? "/admin/dashboard" : "/");

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Login failed";
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Normal signup
  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.data?.message || "Signup failed");

      toast.success(
        data.data?.message || "Signup successful! Please verify your email."
      );
      return data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Try again.";
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up
  const googleSignUp = async (authCode) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/google`,
        { params: { code: authCode } }
      );

      const { user, token, message } = res.data;
      const userData = { ...user, isAdmin: user.isAdmin || false };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      toast.success(message);
      navigate("/");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Google signup failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const googleLogin = async (authCode) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/google`,
        { params: { code: authCode } }
      );

      const { user, token, message } = res.data;
      const userData = { ...user, isAdmin: user.isAdmin || false };
      console.log("userData", userData);
      console.log("token", token);
      console.log("user", user);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      toast.success(message);
      navigate("/");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Google login failed";
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        googleLogin,
        googleSignUp,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
