import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import React, {useState} from 'react'

const ProductManagement = () => {
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
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-600">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {product.status}
                </span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductManagement