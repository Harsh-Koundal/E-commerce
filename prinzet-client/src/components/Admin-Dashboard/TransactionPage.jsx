import React, { useState, useEffect } from "react";
import api from "@/lib/api";

const TransactionsPage = () => {
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/admin/finance/transactions");

        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filtered transactions based on status
  const filtered = filter === "all" ? transactions : transactions.filter((t) => {
    // Map your API status to display-friendly text
    const status = t.paymentStatus || t.settlement?.status;
    if (filter === "Paid") return status === "SUCCESS" || status === "PAID";
    if (filter === "Pending") return status === "PENDING";
    if (filter === "Failed") return status === "FAILED";
    return false;
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Transactions & Settlements</h2>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Settlement Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="border p-2">#{t.orderId}</td>
                <td className="border p-2">{t.userId}</td>
                <td className="border p-2">₹{t.amount.toFixed(2)}</td>
                <td className="border p-2">{t.paymentStatus}</td>
                <td className="border p-2">{t.settlement?.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsPage;
