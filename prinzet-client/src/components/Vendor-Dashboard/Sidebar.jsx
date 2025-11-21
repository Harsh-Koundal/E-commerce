import React, { useState } from "react";
import {
  Activity,
  Package,
  ShoppingBag,
  CreditCard,
  Users,
  Star,
  Bell,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const sidebarItems = [
    { id: "overview", label: "Dashboard Overview", icon: <Activity size={20} />, path: "/vendor/dashboard/overview" },
    { id: "products", label: "Product Management", icon: <Package size={20} />, path: "/vendor/dashboard/products" },
    { id: "order-management", label: "Order Management", icon: <ShoppingBag size={20} />, path: "/vendor/dashboard/order-management" },
    { id: "payment-finance", label: "Payment & Finance", icon: <CreditCard size={20} />, path: "/vendor/dashboard/payment-finance" },
    // { id: "customer-management", label: "Customer Management", icon: <Users size={20} />, path: "/vendor/dashboard/customer-management" },
    // { id: "reviews", label: "Review & Rating", icon: <Star size={20} />, path: "/vendor/dashboard/reviews" },
    // { id: "notifications", label: "Notification", icon: <Bell size={20} />, path: "/vendor/dashboard/notifications" },
    { id: "settings", label: "Setting & Configuration", icon: <Settings size={20} />, path: "/vendor/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-white flex w-fit sticky left-0">
      <div className="w-14 md:w-64 bg-white shadow-sm border-r border-gray-200 transition-all duration-300">
        <div className="mt-6 flex flex-col space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors 
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="hidden md:inline text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
