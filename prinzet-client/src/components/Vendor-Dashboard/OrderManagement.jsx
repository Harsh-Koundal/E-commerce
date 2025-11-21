import {
  Activity,
  CheckCircle,
  Clock,
  FileText,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  //Fetch Orders from API 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Combine main and accessory orders
        const mainOrders = res.data?.data?.orders || [];
        const accessoryOrders = res.data?.data?.accessoryOrders || [];
        setOrders([...mainOrders, ...accessoryOrders]);
        console.log("Fetched orders:", [...mainOrders, ...accessoryOrders]);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Update Order Status -- approve/reject/complete etc.
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("vendorToken");

      let endpoint = "";
      if (newStatus === "completed")
        endpoint = `/api/vendor/order/${orderId}/completed`;
      else if (newStatus === "approved")
        endpoint = `/api/vendor/order/${orderId}/approve`;
      else if (newStatus === "rejected")
        endpoint = `/api/vendor/order/${orderId}/reject`;

      if (!endpoint) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setSelectedOrder(null);
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      approved: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      processing: <Activity className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-bold text-gray-900">Order Management</h2>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.customerDetails?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.subCategory || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.numCopies ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{order.totalCost ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.customerDetails?.address || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Order Details - {selectedOrder._id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p>
                  <b>Product:</b> {selectedOrder.subCategory || "-"}
                </p>
                <p>
                  <b>Quantity:</b> {selectedOrder.numCopies ?? "-"}
                </p>
                <p>
                  <b>Customer:</b> {selectedOrder.customerDetails?.name || "-"}
                </p>
                <p>
                  <b>Total:</b> ₹{selectedOrder.totalCost ?? "-"}
                </p>
                <p>
                  <b>Address:</b> {selectedOrder.customerDetails?.address || "-"}
                </p>
                <p>
                  <b>Status:</b> {selectedOrder.status}
                </p>

                {/* Change Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Change Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["approved", "rejected", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateOrderStatus(selectedOrder._id, status)
                        }
                        className={`px-3 py-1 rounded-md text-xs font-medium border ${
                          selectedOrder.status === status
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
