import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const txnId = searchParams.get("txnId");
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/phonepay/status/${txnId}`,
                    {},
                    { withCredentials: true }
                );

                setStatus(response.data.message || "Unknown status");
            } catch (error) {
                console.error("Error checking payment status:", error);
                setStatus("Payment verification failed. Please contact support.");
            } finally {
                setLoading(false);
            }
        };

        if (txnId) {
            fetchPaymentStatus();
        } else {
            setStatus("Missing transaction ID.");
            setLoading(false);
        }
    }, [txnId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
                {loading ? (
                    <p className="text-blue-600">Checking payment status...</p>
                ) : (
                    <p className={`text-lg font-semibold ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {status}
                    </p>
                )}
                <a
                    href="/"
                    className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Go to Home
                </a>
            </div>
        </div>
    );
};

export default PaymentStatus;
