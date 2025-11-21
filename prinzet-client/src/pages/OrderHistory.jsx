import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const data = res.data.data;
        console.log("Fetched orders:", data);

        data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Order History</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 p-5 rounded-lg shadow-md bg-white"
            >
              <p className="text-lg font-semibold text-gray-800">
                <span className="text-gray-600">Order ID:</span> {order._id}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Category:</span> {order.categoryId?.name || "Unknown"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Copies:</span> {order.numCopies}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total Cost:</span> ₹{order.totalCost}
              </p>
              <p
                className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="text-gray-600 text-sm">
                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-3">
                <strong className="text-gray-700">Files:</strong>
                {Array.isArray(order.files) && order.files.length > 0 ? (
                  <ul className="list-disc ml-5 text-blue-600">
                    {order.files.map((file, index) => (
                      <li key={file._id || index}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View File {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded.</p>
                )}
              </div>
              <button
                onClick={() => (window.location.href = `/track-order/${order._id}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Track Order
              </button>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
