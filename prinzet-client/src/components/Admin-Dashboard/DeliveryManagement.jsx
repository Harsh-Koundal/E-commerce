import React, { useState } from "react";

const DeliveryManagement = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders] = useState([
    { id: "ORD001", product: "Wireless Earbuds", status: "Packed", agent: "Siddhartha" },
    { id: "ORD002", product: "Smartphone", status: "Out for Delivery", agent: "Suddhodhana" },
    { id: "ORD003", product: "Laptop", status: "Shipped", agent: "Rahul" },
    { id: "ORD004", product: "Shoes", status: "Delivered", agent: "Raman" },
  ]);
  const partners = [
    { id: 1, name: "Ravi Kumar", contact: "9876543210", status: "Available", deliveries: 120, rating: 4.8 },
    { id: 2, name: "Aman Singh", contact: "9123456780", status: "Busy", deliveries: 85, rating: 4.5 },
    { id: 3, name: "Priya Sharma", contact: "9988776655", status: "Available", deliveries: 200, rating: 4.9 }
  ];
  const [issues, setIssues] = useState([
    {
      id: "ISS001",
      orderId: "ORD101",
      customer: "Ravi Sharma",
      issue: "Late delivery",
      status: "Open",
      date: "02 Sep 2025",
    },
    {
      id: "ISS002",
      orderId: "ORD102",
      customer: "Priya Verma",
      issue: "Damaged product",
      status: "In Progress",
      date: "03 Sep 2025",
    },
    {
      id: "ISS003",
      orderId: "ORD103",
      customer: "Amit Yadav",
      issue: "Wrong product received",
      status: "Resolved",
      date: "01 Sep 2025",
    },
  ]);
  const statusFlow = [
    "Pending",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Status Tracker Component
  const StatusTracker = ({ currentStatus }) => {
    const currentIndex = statusFlow.indexOf(currentStatus);

    return (
      <div className="flex items-center justify-between w-full">
        {statusFlow.map((status, index) => (
          <div key={status} className="flex flex-col items-center relative flex-1">
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${index <= currentIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            {index < statusFlow.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 w-full h-[2px] ${index < currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                style={{ zIndex: -1 }}
              ></div>
            )}

            {/* Status Label (Small Text Below Circle) */}
            <span
              className={`mt-2 text-xs text-center ${index <= currentIndex ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2 ${activeTab === "orders"
            ? "border-b-2 border-blue-600 font-semibold"
            : "text-gray-500"
            }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`pb-2 ${activeTab === "partners"
            ? "border-b-2 border-blue-600 font-semibold"
            : "text-gray-500"
            }`}
        >
          Delivery Partners
        </button>
        <button
          onClick={() => setActiveTab("issues")}
          className={`pb-2 ${activeTab === "issues"
            ? "border-b-2 border-blue-600 font-semibold"
            : "text-gray-500"
            }`}
        >
          Issues or Queries
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Track Shipments</h2>
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Delivery Agent</th>
                <th className="p-3">Shipment Progress</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">
                    {order.agent ? (
                      <span className="text-gray-800 font-medium">{order.agent}</span>
                    ) : (
                      <span className="text-gray-400 italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusTracker currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}

      {/* Delivery Partners Tab */}
      {activeTab === "partners" && (
        <div className="bg-white shadow rounded p-6 space-y-8">
          {/* Section 1: Assign Partners */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Assign Delivery Partners</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Order ID</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Current Partner</th>
                  <th className="p-3 border">Assign / Change Partner</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3 border">{order.id}</td>
                    <td className="p-3 border">{order.product}</td>
                    <td className="p-3 border">
                      {order.partner ? (
                        <span className="text-green-600 font-medium">{order.partner}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="p-3 border">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        onChange={(e) => handleAssignPartner(order.id, e.target.value)}
                        defaultValue={order.partner || ""}
                      >
                        <option value="">-- Select Partner --</option>
                        {partners.map((partner) => (
                          <option key={partner.id} value={partner.name}>
                            {partner.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Manage Partners */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Delivery Partner Management</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Partner Name</th>
                  <th className="p-3 border">Contact</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Deliveries Done</th>
                  <th className="p-3 border">Rating</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t">
                    <td className="p-3 border">{partner.name}</td>
                    <td className="p-3 border">{partner.contact}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs ${partner.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {partner.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center">{partner.deliveries}</td>
                    <td className="p-3 border text-center">⭐ {partner.rating}</td>
                    <td className="p-3 border space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Issues Tab */}
      {activeTab === "issues" && (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Resolve Delivery Issues</h2>
          <p className="text-gray-600 mb-4">
            Below are the issues reported by customers (late, damaged, or wrong
            product).
          </p>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Issue ID</th>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Issue</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-t">
                  <td className="p-3 border">{issue.id}</td>
                  <td className="p-3 border">{issue.orderId}</td>
                  <td className="p-3 border">{issue.customer}</td>
                  <td className="p-3 border">{issue.issue}</td>
                  <td className="p-3 border">{issue.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
};

export default DeliveryManagement;
