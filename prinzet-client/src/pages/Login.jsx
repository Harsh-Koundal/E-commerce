import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoImg } from "@/assets";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, googleLogin, loading } = useAuth();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // ✅ Normal Login
  const handleLogin = async () => {
    setError(null);
    try {
      await login({ emailOrMobile, password });
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Google Login
  const handleGoogleResponse = (authResult) => {
    if (authResult.code) {
      googleLogin(authResult.code).catch(() =>
        setError("Google Sign In failed. Try again.")
      );
    }
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleGoogleResponse,
    flow: "auth-code",
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-[900px] bg-white shadow-lg rounded-2xl overflow-hidden border relative">
        {/* Left - Login Section */}
        <div className="w-1/2 bg-blue-50 p-10 flex flex-col justify-center relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logoImg} alt="Logo" className="w-24" />
          </div>

          <h2 className="text-3xl font-bold text-gray-700 mb-1 text-center">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Please enter your details
          </p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Email */}
          <input
            type="text"
            placeholder="Email or Mobile"
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400 hover:border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-500 hover:underline"
            >
              
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-3xl font-medium mb-4 shadow-md"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Google Button */}
          <button
            className="w-full bg-white border border-gray-300 py-3 rounded-3xl font-medium flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            onClick={googleSignIn}
            disabled={loading}
          >
            <i className="fab fa-google text-gray-600"></i>
            Sign In with Google
          </button>
        </div>

        {/* Right - Create Account Section */}
        <div className="w-1/2 bg-rose-300 flex flex-col justify-center items-center text-center p-10 relative">
          <h2 className="text-white text-2xl font-bold mb-2">CREATE ACCOUNT</h2>
          <p className="text-white mb-6">Don't have an account? Create one!</p>
          <Link
            to="/signup"
            className="bg-white/80 text-rose-600 py-3 px-6 rounded-full shadow-md hover:bg-white border-2 font-medium w-1/2"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;