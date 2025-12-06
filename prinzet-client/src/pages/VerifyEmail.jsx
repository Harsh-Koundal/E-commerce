import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        let endpoint = "";

        if (location.pathname.includes("vendor")) {
          // Vendor verification
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/auth/verify-email/${token}`;
        } else {
          // Normal user verification
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/verify-email/${token}`;
        }

        const response = await axios.get(endpoint);

        if (response.status === 200) {
          setStatus("verified");
          setTimeout(() => navigate("/email-verified"), 100);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token, navigate, location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {status === "verified" && (
        navigate('/email/verified')
      )}
      {status === "failed" && (
        navigate('/email-verification-failed')
      )}
    </div>
  );
};

export default VerifyEmail;
