import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const TrackOrder = () => {
  const { orderId } = useParams();
  const totalTime = 1 * 60; // 1 minutes
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getStatus = () => {
    const percent = (totalTime - timeLeft) / totalTime;
    if (percent < 0.3) return "Order Placed";
    if (percent < 0.7) return "Out for Delivery";
    if (timeLeft === 0) return "Delivered";
    return "Almost There";
  };

  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Track Your Order</h1>
        <p className="text-sm text-gray-500 mb-6">Order ID: <span className="font-medium text-gray-700">{orderId}</span></p>

        <div className="mb-4">
          <p className="text-xl font-semibold text-gray-800">{getStatus()}</p>
          <p className="text-gray-600 text-sm">Estimated Delivery In</p>
          <p className="text-2xl font-mono text-green-600">{formatTime(timeLeft)}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden my-6">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stages */}
        <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
          <span className={progressPercent >= 0 ? "text-blue-700" : ""}>Order Placed</span>
          <span className={progressPercent >= 50 ? "text-blue-700" : ""}>Out for Delivery</span>
          <span className={progressPercent >= 100 ? "text-blue-700" : ""}>Delivered</span>
        </div>

        {/* Delivered Message */}
        {timeLeft === 0 && (
          <div className="mt-6 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-semibold">
            Your order has been delivered!
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
