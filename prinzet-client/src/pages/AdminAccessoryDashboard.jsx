import { useEffect, useState } from "react";
import axios from "axios";

const AdminAccessoryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    const [filters, setFilters] = useState({
        orderId: "",
        transactionId: "",
        pincode: "",
        status: "",
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/accessory-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(res.data.data);
                setFilteredOrders(res.data.data);
            } catch (err) {
                console.error("Error fetching accessory orders:", err);
                setError("Failed to load accessory orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const applyFilters = () => {
        const filtered = orders.filter((order) => {
            return (
                (filters.orderId === "" || order.orderId?.toLowerCase().includes(filters.orderId.toLowerCase())) &&
                (filters.transactionId === "" || order.transactionId?.toLowerCase().includes(filters.transactionId.toLowerCase())) &&
                (filters.pincode === "" || order.userId?.address?.pincode?.toString().includes(filters.pincode)) &&
                (filters.status === "" || order.status?.toLowerCase() === filters.status.toLowerCase())
            );
        });
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        applyFilters();
    }, [filters, orders]);

    const clearFilters = () => {
        setFilters({ orderId: "", transactionId: "", pincode: "", status: "" });
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderStatusBadge = (status) => {
        const base = "px-2 py-1 rounded-full text-xs font-semibold";
        if (status === "completed") return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
        if (status === "pending") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    };

    if (loading) return <div className="p-6 bg-gray-50 min-h-screen">Loading...</div>;
    if (error) return <div className="p-6 bg-gray-50 min-h-screen text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Accessory Printing Orders</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-white p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="Order ID"
                    className="px-3 py-2 border rounded shadow-sm"
                    value={filters.orderId}
                    onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Transaction ID"
                    className="px-3 py-2 border rounded shadow-sm"
                    value={filters.transactionId}
                    onChange={(e) => setFilters({ ...filters, transactionId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Pincode"
                    className="px-3 py-2 border rounded shadow-sm"
                    value={filters.pincode}
                    onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                />
                <select
                    className="px-3 py-2 border rounded shadow-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            {[
                                "Order ID", "Transaction ID", "User", "Address", "Material", "Size", "Color", "Customization", "Copies",
                                "Cost", "Created At", "Status", "Files", "Actions"
                            ].map((head, i) => (
                                <th key={i} className="border p-2 text-left">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order, idx) => (
                            <tr key={order._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border p-2">{order.orderId}</td>
                                <td className="border p-2">{order.transactionId}</td>
                                <td className="border p-2">{order.userId?.email || "N/A"}</td>
                                <td className="border p-2">
                                    {order.userId?.address ? (
                                        <>
                                            <p>{order.userId.address.address}</p>
                                            <p>{order.userId.address.city}, {order.userId.address.state} - {order.userId.address.pincode}</p>
                                        </>
                                    ) : <p className="text-gray-500">No address</p>}
                                </td>
                                <td className="border p-2">{order.material}</td>
                                <td className="border p-2">{order.size}</td>
                                <td className="border p-2">{order.color}</td>
                                <td className="border p-2">
                                    {order.customization && Object.entries(order.customization).map(([key, val]) => (
                                        <p key={key}><strong>{key}:</strong> {val}</p>
                                    ))}
                                </td>
                                <td className="border p-2">{order.numCopies}</td>
                                <td className="border p-2">₹{order.totalCost}</td>
                                <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="border p-2">{renderStatusBadge(order.status)}</td>
                                <td className="border p-2 space-y-1">
                                    {order.files?.length ? order.files.map((file, i) => (
                                        <a
                                            key={i}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:underline"
                                        >
                                            View File {i + 1}
                                        </a>
                                    )) : <span className="text-gray-500">No Files</span>}
                                </td>
                                <td className="border p-2">
                                    {order.status !== "completed" && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem("token");
                                                    await axios.put(
                                                        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/accessory-orders/${order._id}`,
                                                        { status: "completed" },
                                                        { headers: { Authorization: `Bearer ${token}` } }
                                                    );
                                                    setOrders((prev) =>
                                                        prev.map((o) =>
                                                            o._id === order._id ? { ...o, status: "completed" } : o
                                                        )
                                                    );
                                                } catch (err) {
                                                    console.error("Error updating status", err);
                                                    setError("Failed to update order.");
                                                }
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 text-gray-700 font-semibold">{currentPage}</span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastOrder >= filteredOrders.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminAccessoryDashboard;
