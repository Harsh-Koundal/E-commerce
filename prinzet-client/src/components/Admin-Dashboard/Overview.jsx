import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const Overview = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [userPercent , setUserPercent] = useState(0);
  const [totalProducts, setTotalProducts] = useState(null);
  const [revenue , setRevenue] = useState(0);
  const [revenuePercent , setRevenuePercent] = useState(0);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orders = res.data?.data || [];
      setOrders(orders);
    } catch (err) {
      console.error("Failed to load orders:", err.response?.data || err.message);
      toast.error("Failed to load recent orders");
    }
  };


  const fetchTopProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/top-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const products = res.data.data || [];
      setProducts(products);

    } catch (err) {
      console.error("Failed to load products:", err.response?.data || err.message);
      toast.error("Failed to load recent products");
    }
  };



const fetchTotalProducts = async () => {
  try {
    const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/total-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTotalProducts(res.data.totalProducts);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTotalUsers(res.data.totalUsers);
      setUserPercent(res.data.percentageChange)
      console.log(res)
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenue = async()=>{
    try{
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/revenue`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRevenue(res.data.currentRevenue);
      setRevenuePercent(res.data.percentageChange);
    }catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
  if (!token) return;
  fetchOrders();
  fetchUsers();
  fetchTopProducts();
  fetchTotalProducts();
  fetchRevenue();
}, [token]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+{userPercent}% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹ {revenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+{revenuePercent}% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+0% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.orderId}</p>
                  <p className="text-sm text-gray-600">{order.customerDetails.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.totalCost}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
  <h3 className="text-lg font-semibold mb-4">Top Products</h3>

  <div className="space-y-4">
    {products.slice(0, 5).map((item, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        {/* Left Side */}
        <div>
          <p className="font-medium capitalize">{item.subCategory}</p>
        </div>

        {/* Right Side */}
        <div className="text-right">
          <p className="font-medium">
            ₹{item.lastOrderPrice?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Orders: {item.totalOrders}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  )
}

export default Overview