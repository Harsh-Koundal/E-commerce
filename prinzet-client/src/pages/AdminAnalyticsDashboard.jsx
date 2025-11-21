import { FiBarChart2, FiDollarSign, FiShoppingCart, FiCheckCircle, FiClock, FiSlash } from "react-icons/fi";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
  
  const dailyRevenue = "₹12,340";
  const dailyOrders = 58;

  const vendorStats = {
    active: 12,
    pending: 5,
    blocked: 2,
  };

  
  const revenueData = [
    { day: "Mon", revenue: 8000 },
    { day: "Tue", revenue: 9500 },
    { day: "Wed", revenue: 7200 },
    { day: "Thu", revenue: 10400 },
    { day: "Fri", revenue: 8700 },
    { day: "Sat", revenue: 12000 },
    { day: "Sun", revenue: 13400 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
        <FiBarChart2 className="text-pink-500 text-3xl" />
        Analytics Overview
      </h2>

      {/* Revenue + Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Daily Revenue */}
        <div className="flex items-center justify-between p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FiDollarSign className="text-green-500 text-2xl" />
              Daily Revenue
            </h3>
            <p className="text-gray-500 text-sm">Total earnings for today</p>
          </div>
          <span className="text-2xl font-bold text-green-600">{dailyRevenue}</span>
        </div>

        {/* Daily Orders */}
        <div className="flex items-center justify-between p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FiShoppingCart className="text-blue-500 text-2xl" />
              Daily Orders
            </h3>
            <p className="text-gray-500 text-sm">Orders placed today</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">{dailyOrders}</span>
        </div>
      </div>

      {/* Vendor Status Cards */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Vendor Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {/* Active Vendors */}
        <div className="flex items-center justify-between p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FiCheckCircle className="text-green-500 text-2xl" />
              Active Vendors
            </h3>
            <p className="text-gray-500 text-sm">Currently approved vendors</p>
          </div>
          <span className="text-2xl font-bold text-green-600">{vendorStats.active}</span>
        </div>

        {/* Pending Vendors */}
        <div className="flex items-center justify-between p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FiClock className="text-yellow-500 text-2xl" />
              Pending Vendors
            </h3>
            <p className="text-gray-500 text-sm">Awaiting approval</p>
          </div>
          <span className="text-2xl font-bold text-yellow-600">{vendorStats.pending}</span>
        </div>

        {/* Blocked Vendors */}
        <div className="flex items-center justify-between p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <FiSlash className="text-red-500 text-2xl" />
              Blocked Vendors
            </h3>
            <p className="text-gray-500 text-sm">Suspended/blocked vendors</p>
          </div>
          <span className="text-2xl font-bold text-red-600">{vendorStats.blocked}</span>
        </div>
      </div>

      {/* Revenue Chart */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Revenue Trend (Last 7 Days)</h3>
      <div className="bg-white shadow-md rounded-xl p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} />
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;
