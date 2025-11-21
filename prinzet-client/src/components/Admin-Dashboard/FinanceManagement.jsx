import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, RefreshCcw } from "lucide-react";

const FinanceManagement = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Track Transactions & Settlements",
      description: "Monitor all incoming and outgoing payments in real-time.",
      icon: <CreditCard className="w-8 h-8 text-blue-500" />,
      path: "/admin/dashboard/finance-transactions",
    },
    {
      title: "Generate Financial Reports",
      description: "Download daily, monthly, and yearly financial summaries.",
      icon: <FileText className="w-8 h-8 text-green-500" />,
      path: "/admin/dashboard/finance-reports",
    },
    {
      title: "Manage Vendor Payments & Refunds",
      description: "Handle vendor payouts and customer refunds seamlessly.",
      icon: <RefreshCcw className="w-8 h-8 text-purple-500" />,
      path: "/admin/dashboard/finance-payments",
    },
  ];

  return (
    <div className="p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Main Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Finance Management
        </h2>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="cursor-pointer border rounded-xl p-5 flex flex-col gap-3 bg-gray-50 hover:bg-blue-50 transition"
            >
              <div>{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-700">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <span className="text-blue-600 text-sm font-medium mt-auto">
                Learn More →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
