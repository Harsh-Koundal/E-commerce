import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const OperationAnalyticsForAdmin = () => {
  const analyticsData = [
    { name: "Orders", value: 120 },
    { name: "Deliveries", value: 95 },
    { name: "Returns", value: 15 },
    { name: "Cancellations", value: 40 },
  ];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OperationAnalyticsForAdmin