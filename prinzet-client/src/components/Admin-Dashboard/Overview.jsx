import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react'

const Overview = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Poster",
      price: 99.99,
      stock: 50,
      category: "document",
      status: "Active",
    },
    {
      id: 2,
      name: "Tshirt",
      price: 299.99,
      stock: 25,
      category: "cloathing",
      status: "Active",
    },
    {
      id: 3,
      name: "Coffee Mug",
      price: 15.99,
      stock: 100,
      category: "Home",
      status: "Draft",
    },
  ]);
  const [orders, setOrders] = useState([
    {
      id: "#ORD-001",
      customer: "John Doe",
      total: 149.99,
      status: "Processing",
      date: "2024-08-25",
      items: [{ name: "Coffee Mug", qty: 5, price: 300 }],
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      total: 299.99,
      status: "Shipped",
      date: "2024-08-24",
      items: [{ name: "Polo T-shirt", qty: 3, price: 400 }],
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      total: 75.5,
      status: "Delivered",
      date: "2024-08-23",
      items: [{ name: "Mouse Pad", qty: 2, price: 500 }],
    },
  ]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹ 0</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+0% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+0% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.price}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview