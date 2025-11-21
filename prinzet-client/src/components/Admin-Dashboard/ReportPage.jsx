import React from "react";

const ReportsPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Financial Reports</h2>

      <div className="space-y-4">
        <p className="text-gray-600">Generate and download reports:</p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Download Daily Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Download Monthly Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Download Yearly Report
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          <li>Total Orders: 320</li>
          <li>Total Revenue: ₹4,50,000</li>
          <li>Refunds Processed: ₹15,000</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsPage;
