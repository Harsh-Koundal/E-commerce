import React, { useEffect, useState } from "react";
import { IndianRupee, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentFinance = () => {
  const [revenue, setRevenue] = useState({
    total: 0,
    pending: 0,
    thisMonth: 0,
  });

  const [transactions, setTransactions] = useState([]);

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
        const orders = res.data?.data?.orders || [];
        const accessoryOrders = res.data?.data?.accessoryOrders || [];
        const totalOrders = [...orders, ...accessoryOrders];
        console.log(totalOrders)

        // Revenue calculations
        const totalRevenue = totalOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0);
        const pendingRevenue = totalOrders
          .filter((o) => o.status === "pending")
          .reduce((sum, o) => sum + (o.totalCost || 0), 0);
        const thisMonth = totalOrders
          .filter((o) => new Date(o.createdAt).getMonth() === new Date().getMonth())
          .reduce((sum, o) => sum + (o.totalCost || 0), 0);

        setRevenue({
          total: totalRevenue,
          pending: pendingRevenue,
          thisMonth,
        });

        const txns = totalOrders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => ({
            id: order.transactionId || order.orderId,
            amount: order.totalCost,
            status:
              order.status === "completed"
                ? "Completed"
                : order.status === "pending"
                ? "Pending"
                : order.status,
            date: new Date(order.createdAt).toLocaleDateString(),
          }));

        setTransactions(txns);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error(err.response?.data?.message || "Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Payment & Finance</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹ ${revenue.total}`}
          icon={<IndianRupee />}
          color="green"
        />
        <StatCard
          title="Pending Payments"
          value={`₹ ${revenue.pending}`}
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          title="This Month"
          value={`₹ ${revenue.thisMonth}`}
          icon={<TrendingUp />}
          color="blue"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{txn.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentFinance;
