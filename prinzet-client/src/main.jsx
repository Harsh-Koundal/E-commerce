import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { VendorAuthProvider } from "./context/VendorAuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 👈 import provider



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
      <AuthProvider>
        <CartProvider>
            <VendorAuthProvider>
            <GoogleOAuthProvider clientId={'172602859774-mmfjh204g13oo38r51nqogsc5pvbqva9.apps.googleusercontent.com'}>
              <App />
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </GoogleOAuthProvider>
          </VendorAuthProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
