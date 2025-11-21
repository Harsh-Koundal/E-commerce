import { Clock, IndianRupee, Package, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import SalesChart from "../charts/SalesChart";
import TopProductsChart from "../charts/TopProductChart";
import OrdersStatusChart from "../charts/OrderStatusChart";
import StatCard from "./StatCard";
import axios from "axios";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    productsCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/orders`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("vendorToken")}` },
          }
        );
        console.log(res.data)

        // total of all orders
        const orders = res.data?.data?.orders || [];
        const accessoryOrders = res.data?.data?.accessoryOrders || [];
        const total = [...orders, ...accessoryOrders];

        // Status counts
        const pending = total.filter((o) => o.status === "pending").length;
        const processing = total.filter((o) => o.status === "processing").length;
        const completed = total.filter((o) => o.status === "completed").length;
        
        // Revenue
        const revenue = total.reduce((sum, o) => sum + (o.totalCost || 0), 0);

        const productsSet = new Set();
        total.forEach((order) => {
          if (order.items) {
            order.items.forEach((item) => {
              if (item.productName) productsSet.add(item.productName);
            });
          }
        });

        setStats({
          totalOrders: total.length,
          revenue,
          pending,
          processing,
          completed,
          productsCount: productsSet.size,
        });

        // Recent orders 
        const sortedOrders = [...total].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentOrders(sortedOrders.slice(0, 5));

        // Top products
        const productCounts = {};
        total.forEach((order) => {
          if (order.items) {
            order.items.forEach((item) => {
              if (item.productName) {
                productCounts[item.productName] =
                  (productCounts[item.productName] || 0) + (item.quantity || 1);
              }
            });
          }
        });
        const topProductsData = Object.entries(productCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopProducts(topProductsData);

        // Sales by date
        const salesByDate = {};
        total.forEach((order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          salesByDate[date] = (salesByDate[date] || 0) + (order.totalCost || 0);
        });
        const salesArray = Object.entries(salesByDate)
          .map(([date, revenue]) => ({
            date,
            revenue,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setSalesData(salesArray);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-8 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag />} color="blue" />
        <StatCard title="Revenue" value={`₹ ${stats.revenue}`} icon={<IndianRupee />} color="green" />
        <StatCard title="Pending Orders" value={stats.pending} icon={<Clock />} color="yellow" />
        <StatCard title="Active Products" value={stats.productsCount} icon={<Package />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <OrdersStatusChart data={stats} />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <SalesChart data={salesData} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="w-full min-w-[600px] border-collapse border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.customerDetails?.name || "N/A"}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">₹{order.totalCost}</td>
                <td className="border p-2">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverview;