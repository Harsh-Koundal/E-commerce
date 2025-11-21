import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Vendor-Dashboard/Sidebar";
import DashboardOverview from "../components/Vendor-Dashboard/DashboardOverview";
import ProductManagement from "../components/Vendor-Dashboard/ProductManagement";
import OrderManagement from "../components/Vendor-Dashboard/OrderManagement";
import PaymentFinance from "../components/Vendor-Dashboard/PaymentFinance";
import CustomerManagement from "../components/Vendor-Dashboard/CustomerManagement";
import Reviews from "../components/Vendor-Dashboard/Reviews";
import Notifications from "../components/Vendor-Dashboard/Notifications";
import Settings from "../components/Vendor-Dashboard/Settings";

const VendorDashboard = () => {
  const { section } = useParams();

  const renderPage = () => {
    switch (section) {
      case "overview":
        return <DashboardOverview />;
      case "products":
        return <ProductManagement />;
      case "order-management":
        return <OrderManagement />;
      case "payment-finance":
        return <PaymentFinance />;
      case "customer-management":
        return <CustomerManagement />;
      case "reviews":
        return <Reviews />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />; 
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 overflow-scroll">{renderPage()}</div>
    </div>
  );
};

export default VendorDashboard;

