import React from "react";
import { TrendingUp,TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon, change, color = "blue" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {value}
          </p>
          {change !== undefined && (
            <p
              className={`text-xs sm:text-sm flex items-center mt-2 font-medium ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {change > 0 ? "+" : ""}
              {change}%
            </p>
          )}
        </div>
        <div
          className={`p-3 sm:p-4 rounded-2xl bg-${color}-100 shadow-sm flex items-center justify-center`}
        >
          {React.cloneElement(icon, {
            className: `w-5 h-5 sm:w-7 sm:h-7 text-${color}-600`,
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
