// src/context/VendorAuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {
  const [vendorInfo, setVendorInfo] = useState(null);
  const [vendorToken, setVendorToken] = useState(null);

  useEffect(() => {
    const storedVendor = localStorage.getItem("vendorInfo");
    const storedToken = localStorage.getItem("vendorToken");

    if (storedVendor && storedToken) {
      setVendorInfo(JSON.parse(storedVendor));
      setVendorToken(storedToken);
    }
  }, []);

  const vendorLogin = (info, token) => {
    localStorage.setItem("vendorInfo", JSON.stringify(info));
    localStorage.setItem("vendorToken", token);
    setVendorInfo(info);
    setVendorToken(token);
  };

  const vendorLogout = () => {
    localStorage.removeItem("vendorInfo");
    localStorage.removeItem("vendorToken");
    setVendorInfo(null);
    setVendorToken(null);
  };

  return (
    <VendorAuthContext.Provider
      value={{ vendorInfo, vendorToken, vendorLogin, vendorLogout }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => useContext(VendorAuthContext);
