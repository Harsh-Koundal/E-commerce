import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Package,
  Truck,
  DollarSign,
  Settings,
  UserCheck,
  Gift,
  Edit,
  Activity,
  Bell,
} from "lucide-react";
import BlogManagement from "@/components/Admin-Dashboard/BlogManagement";
import DeliveryManagement from "@/components/Admin-Dashboard/DeliveryManagement";
import AdminSettings from "@/components/Admin-Dashboard/AdminSettings";
import OperationManagement from "@/components/Admin-Dashboard/OperationManagement";
import FinanceManagement from "@/components/Admin-Dashboard/FinanceManagement";
import UserManagement from "./UserManagement";
import AdminVendorDashboard from "./AdminVendorDashboard";
import AdminOrderManagement from "@/components/Admin-Dashboard/order-management/AdminOrderManagement";
import Overview from "@/components/Admin-Dashboard/Overview";
import ProductManagement from "@/components/Admin-Dashboard/ProductManagement";
import { useNavigate, useParams } from "react-router-dom";
import LoyaltyProgram from "@/components/Admin-Dashboard/LoyaltyProgram";
import AddNewBlog from "../components/Admin-Dashboard/AddNewBlog";
import EditBlog from "../components/Admin-Dashboard/EditBlog";
import TransactionsPage from "@/components/Admin-Dashboard/TransactionPage";
import ReportsPage from "@/components/Admin-Dashboard/ReportPage";
import PaymentsPage from "@/components/Admin-Dashboard/PaymentPage";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { section } = useParams();
  const  { id }   =useParams();
  const modules = [
    { id: "overview", name: "Overview", icon: Activity, path: "/admin/dashboard/overview" },
    { id: "user", name: "User Management", icon: Users, path: "/admin/dashboard/user" },
    { id: "blog", name: "Blog Management", icon: Edit, path: "/admin/dashboard/blog" },
    { id: "order", name: "Order Management", icon: ShoppingBag, path: "/admin/dashboard/order" },
    { id: "product", name: "Product Management", icon: Package, path: "/admin/dashboard/product" },
    { id: "finance", name: "Finance Management", icon: DollarSign, path: "/admin/dashboard/finance" },
    { id: "delivery", name: "Delivery Management", icon: Truck, path: "/admin/dashboard/delivery" },
    { id: "operation", name: "Operation Management", icon: Settings, path: "/admin/dashboard/operation" },
    { id: "vendor", name: "Vendor Management", icon: UserCheck, path: "/admin/dashboard/vendor" },
    { id: "loyalty", name: "Loyalty Program", icon: Gift, path: "/admin/dashboard/loyalty" },
    { id: "settings", name: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleModuleClick = (module) => {
    navigate(module.path);
    setSidebarOpen(false);
  };
  const activeModule = section || "overview";
  const isEditingBlog = section === "edit-blog" && id;

  const renderContent = () => {
    if (isEditingBlog) return <EditBlog id={id} />;
    switch (activeModule) {
      case "overview":
        return <Overview />;
      case "user":
        return <UserManagement />;
      case "product":
        return <ProductManagement />;
      case "order":
        return <AdminOrderManagement />;
      case "blog":
        return <BlogManagement />;
      case "delivery":
        return <DeliveryManagement />;
      case "settings":
        return <AdminSettings />;
      case "operation":
        return <OperationManagement />;
      case "vendor":
        return <AdminVendorDashboard />;
      case "finance":
        return <FinanceManagement />;
      case "loyalty":
        return <LoyaltyProgram />;
      case "new-blog":
        return <AddNewBlog />;
      case "edit-blog":
        return <EditBlog />;
      case "finance-transactions":
        return <TransactionsPage />;
      case "finance-reports":
        return <ReportsPage />;
      case "finance-payments":
        return <PaymentsPage />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="max-w-md mx-auto">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Module under development
              </h3>
              <p className="text-gray-600">
                Advanced functionality will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex ">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden mt-7">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module)}
                      className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${activeModule === module.id
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {module.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* const check=activeModule.includes */}
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4 py-5">
            <h1 className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <nav className="mt-2 flex-1 px-2 space-y-1">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${activeModule.includes(module.id)
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {module.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {modules.find((m) => m.id.includes(section))?.name || "Admin Dashboard"}
            </h2>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="hidden md:block text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
