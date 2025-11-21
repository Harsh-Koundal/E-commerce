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
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/verify-email/${token}`;
          navigate('/email-verified')
        } else {
          // Normal user verification
          endpoint = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/verify-email/${token}`;
          navigate('/email-verified')
        }

        const response = await axios.get(endpoint);

        if (response.status === 200) {
          setStatus("verified");
          setTimeout(() => navigate("/email-verified"), 2000);
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
        <>
          <h1 className="text-4xl font-bold text-green-600"> Email Verified!</h1>
          <p className="text-lg mt-4">You are now verified!</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-4xl font-bold text-green-600"> Email Verified!</h1>
          <p className="text-lg mt-4">You are now verified!</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
