import React, { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, Search, Eye, Edit } from "lucide-react";

const AdminOrderManagement = ({ isMobile = false }, children) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_REACT_APP_BACKEND_BASEURL ||
    "http://localhost:5000/api";

  // Axios instance with interceptors
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        setError("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      }
      return Promise.reject(error);
    }
  );

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/admin/orders");
      const orderData = response.data.orders || response.data;

      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("");

      await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setSuccessMessage("Order status updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update order status. Please try again."
      );
    }
  };

  // Process refund
  const handleRefund = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to process a refund for this order?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await axiosInstance.post(`/admin/orders/${orderId}/refund`, {
        reason: "Admin initiated refund",
      });

      setSuccessMessage("Refund processed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refresh orders to get updated data
      fetchOrders();
    } catch (err) {
      console.error("Error processing refund:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process refund. Please try again."
      );
    }
  };

  // Save edit
  const saveEdit = () => {
    setEditingOrderId(null);
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  // Export orders
  const handleExportOrders = () => {
    const csvContent = [
      ["Order ID", "Customer", "Total", "Status", "Date"].join(","),
      ...filteredOrders.map((order) =>
        [order.id, order.customer, order.total, order.status, order.date].join(
          ","
        )
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExportOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || filteredOrders.length === 0}
          >
            Export Orders
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            {isMobile ? (
              <div className="p-4 space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      {editingOrderId === order.id ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                          <option>Refunded</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "Refunded"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <p>Total: ${order.total}</p>
                      <p>Date: {order.date}</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setViewingOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {editingOrderId === order.id ? (
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingOrderId(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}

                      {order.status !== "Refunded" && (
                        <button
                          onClick={() => handleRefund(order.id)}
                          className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingOrderId === order.id ? (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                              <option>Refunded</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "Refunded"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => setViewingOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {editingOrderId === order.id ? (
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-900"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingOrderId(order.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {order.status !== "Refunded" && (
                              <button
                                onClick={() => handleRefund(order.id)}
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Order Details - {viewingOrder.id}
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Customer:</strong> {viewingOrder.customer}
              </p>
              <p>
                <strong>Total:</strong> ${viewingOrder.total}
              </p>
              <p>
                <strong>Status:</strong> {viewingOrder.status}
              </p>
              <p>
                <strong>Date:</strong> {viewingOrder.date}
              </p>
            </div>

            {viewingOrder.items && viewingOrder.items.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {viewingOrder.items.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.name} - Qty: {item.qty} - ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setViewingOrder(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
