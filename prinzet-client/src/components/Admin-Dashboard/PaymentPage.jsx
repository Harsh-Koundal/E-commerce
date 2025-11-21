import React from "react";

const PaymentsPage = () => {
  const vendorPayments = [
    { id: 1, vendor: "Vendor A", amount: 20000, status: "Paid" },
    { id: 2, vendor: "Vendor B", amount: 15000, status: "Pending" },
  ];

  const refunds = [
    { id: 1, orderId: "#ORD120", customer: "Ravi Kumar", amount: 1200, status: "Processed" },
    { id: 2, orderId: "#ORD121", customer: "Anita Sharma", amount: 800, status: "Pending" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Vendor Payments & Refunds</h2>

      {/* Vendor Payments */}
      <h3 className="text-lg font-semibold mb-2">Vendor Payments</h3>
      <table className="w-full border-collapse border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {vendorPayments.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border p-2">{p.vendor}</td>
              <td className="border p-2">₹{p.amount}</td>
              <td className="border p-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Refunds */}
      <h3 className="text-lg font-semibold mb-2">Customer Refunds</h3>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.orderId}</td>
              <td className="border p-2">{r.customer}</td>
              <td className="border p-2">₹{r.amount}</td>
              <td className="border p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsPage;
