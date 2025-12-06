import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    FileText,
    User,
    MapPin,
    Package,
    DollarSign,
    Calendar,
    CreditCard,
} from "lucide-react";
import api from "@/lib/api";
import { useParams } from "react-router-dom";

const AdminDocumentDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(9);
    const {id}=useParams();
    const [filters, setFilters] = useState({
        orderId: "",
        transactionId: "",
        pincode: "",
        status: "",
    });

    const [vendors] = useState([
        { _id: "v1", name: "Printify Solutions", email: "printify@example.com" },
        { _id: "v2", name: "PaperWorks India", email: "paperworks@example.com" },
        { _id: "v3", name: "Rapid Print Hub", email: "rapidprint@example.com" },
    ]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // console.log(res)
                setOrders(res.data.data);
                setFilteredOrders(res.data.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);
    const fetchOrderById = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedOrder(res.data.data);
            // console.log(res.data.data)
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
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
    }, [filters, orders]);

    const clearFilters = () => {
        setFilters({ orderId: "", transactionId: "", pincode: "", status: "" });
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderStatusBadge = (status) => {
        const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center";
        if (status === "completed") return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
        if (status === "pending") return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Document Printing Orders</h2>

                {/* Filters Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Order ID"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.orderId}
                            onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Transaction ID"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.transactionId}
                            onChange={(e) => setFilters({ ...filters, transactionId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Pincode"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.pincode}
                            onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={clearFilters}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 h-[110vh]">
                    {/* Left Column: Order List */}
                    <div className="w-1/3 bg-white rounded-lg shadow-md overflow-y-auto p-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders</h3>
                        {currentOrders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => {
                                    // setSelectedOrder(order)
                                    fetchOrderById(order?._id);
                                }}
                                className={`cursor-pointer border px-4 py-3 rounded-md mb-2 hover:bg-gray-100 transition ${selectedOrder?._id === order._id ? "bg-blue-50 border-blue-400" : "border-gray-200"
                                    }`}
                            >
                                <p className="text-sm font-medium text-gray-800">#{order.orderId?.split("-").pop().toUpperCase()}</p>
                                <p className="text-xs text-gray-500 truncate">{order.userId?.email || "N/A"}</p>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="mt-6 flex justify-between items-center">
                            <button
                                className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-xs text-gray-600">
                                Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
                            </span>
                            <button
                                className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={indexOfLastOrder >= filteredOrders.length}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Selected Order Details */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedOrder ? (
                            <div key={selectedOrder._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-[#e11d48] to-rose-400 p-4 text-white border-t rounded-t-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs opacity-90">Order ID</p>
                                            <p className="font-bold text-lg">#{selectedOrder.orderId?.split("-").pop().toUpperCase()}</p>
                                        </div>
                                        {renderStatusBadge(selectedOrder.status)}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 space-y-3">
                                    {/* User Info */}
                                    <div className="flex items-start space-x-2">
                                        <User className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Customer</p>
                                            <p className="text-sm font-medium text-gray-800 truncate">{selectedOrder.userId?.email || "N/A"}</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Address</p>
                                            {selectedOrder.customerDetails?.address ? (
                                                <p className="text-sm text-gray-700">
                                                    {selectedOrder.customerDetails.address}, {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} - {selectedOrder.customerDetails.pincode}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-400">{selectedOrder.userId ? "Address not available" : "User not found"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-start space-x-2">
                                        <Package className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Category</p>
                                            <p className="text-sm font-medium text-gray-800">{selectedOrder.categoryId?.name || "No Category"}</p>
                                            {selectedOrder.subCategory && <p className="text-xs text-gray-600">{selectedOrder.subCategory}</p>}
                                        </div>
                                    </div>

                                    {/* Print Details */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-2">Print Specifications</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div><span className="text-gray-600">Copies:</span> <span className="font-medium">{selectedOrder.numCopies || 1}</span></div>
                                            <div><span className="text-gray-600">Pages:</span> <span className="font-medium">{selectedOrder.totalPages || "N/A"}</span></div>
                                            <div><span className="text-gray-600">Color:</span> <span className="font-medium">{selectedOrder.colorType === "color" ? "Color" : "B&W"}</span></div>
                                            <div><span className="text-gray-600">Sides:</span> <span className="font-medium">{selectedOrder.printedSides || "N/A"}</span></div>
                                            <div><span className="text-gray-600">Paper:</span> <span className="font-medium">{selectedOrder.paperType || "N/A"}</span></div>
                                            <div><span className="text-gray-600">Quality:</span> <span className="font-medium">{selectedOrder.printQuality || "N/A"}</span></div>
                                            <div><span className="text-gray-600">Binding:</span> <span className="font-medium">{selectedOrder.binding || "N/A"}</span></div>
                                            <div><span className="text-gray-600">Lamination:</span> <span className="font-medium">{selectedOrder.lamination || "N/A"}</span></div>
                                        </div>
                                    </div>

                                    {/* Cost */}
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Total Cost</p>
                                            <p className="text-lg font-bold text-green-600">₹{selectedOrder.totalCost || 0}</p>
                                        </div>
                                    </div>

                                    {/* Files */}
                                    <div className="flex items-start space-x-2">
                                        <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Files</p>
                                            {selectedOrder.files?.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedOrder.files.map((file, index) => (
                                                        <a
                                                            key={index}
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                                                        >
                                                            File {index + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">No files uploaded</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vendor assignment */}
                                    <VendorAssign pincode={selectedOrder.customerDetails?.pincode} order={selectedOrder} />
                                   
                                    {/* Payment Info */}
                                    <div className="flex items-start space-x-2 border-t pt-3">
                                        <CreditCard className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Payment</p>
                                            <p className="text-sm text-gray-700">{selectedOrder.paymentMethod || "N/A"}</p>
                                            {selectedOrder.transactionId && <p className="text-xs text-gray-600 truncate">TXN: {selectedOrder.transactionId}</p>}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <p className="text-xs text-gray-600">
                                            {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                                Select an order from the list
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDocumentDashboard;



const VendorAssign = ({ pincode, order }) => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(order?.vendor?._id || "");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!pincode) return;
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5020/api/vendor/vendors?pincode=${pincode}`);
                if (res.data?.data) setVendors(res.data.data);
            } catch (err) {
                console.error("Error fetching vendors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, [pincode]);

    const selectedVendorData = vendors.find(v => v._id === selectedVendor); // ✅ Added

    const handleAssign = async () => {
        const vendor = vendors.find((v) => v._id === selectedVendor);
        if (!vendor) {
            alert("Please select a vendor first");
            return;
        }

        try {
            const res = await api.post(
                `/admin/orders/${order._id}/assign-vendor`,
                { vendorId: vendor._id }
            );

            if (res.data.type === "success") {
                alert(` Assigned ${vendor.name} to Order ${order.orderId} successfully`);
                console.log("Updated Order:", res.data.data);
            } else {
                alert("Failed to assign vendor");
            }
        } catch (error) {
            console.error("Error assigning vendor:", error);
            alert("Error assigning vendor");
        }
    };

    return (
        <>
            {/* Vendor assignment */}
            <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Assign Vendor</p>

                <div ref={dropdownRef} className="relative w-full mb-2">
                    <button
                        type="button"
                        onClick={() => !loading && setIsOpen(!isOpen)}
                        disabled={loading}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-gray-400 transition-colors disabled:bg-gray-50"
                    >
                        <div className="flex justify-between items-center">
                            {loading ? (
                                <span className="text-gray-400">Loading...</span>
                            ) : selectedVendorData ? (
                                <div>
                                    <p className="text-gray-800 font-medium">{selectedVendorData.pressName}</p>
                                    <p className="text-xs text-gray-500">{selectedVendorData.name}</p>
                                </div>
                            ) : (
                                <span className="text-gray-400">Select Vendor</span>
                            )}
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {isOpen && !loading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {vendors.map((vendor) => (
                                <div
                                    key={vendor._id}
                                    onClick={() => {
                                        setSelectedVendor(vendor._id);
                                        setIsOpen(false);
                                    }}
                                    className={`px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${selectedVendor === vendor._id ? 'bg-blue-50' : ''}`}
                                >
                                    <p className="text-sm font-medium text-gray-800">{vendor.pressName}</p>
                                    <p className="text-xs text-gray-500">{vendor.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAssign}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedVendor
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!selectedVendor}
                >
                    Assign Vendor
                </button>
            </div>

            {/* Vendor details */}
            {order.vendor?.name && (
                <div className="border-t pt-3">
                    <p className="text-xs text-gray-500">Vendor</p>
                    <p className="text-sm font-medium text-gray-800">{order.vendor.name}</p>
                    <p className="text-xs text-gray-600">{order.vendor.email}</p>
                </div>
            )}
        </>
    );
};



