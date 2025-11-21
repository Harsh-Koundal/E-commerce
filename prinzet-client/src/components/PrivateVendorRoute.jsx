// components/PrivateVendorRoute.jsx
import { Navigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";

const PrivateVendorRoute = ({ children }) => {
  const { vendorInfo, vendorToken } = useVendorAuth();

  return vendorInfo && vendorToken ? children : <Navigate to="/login" />;
};

export default PrivateVendorRoute;
