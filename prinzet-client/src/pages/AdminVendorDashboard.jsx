import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiXCircle } from "react-icons/fi";
import api from "@/lib/api";

const AdminVendorDashboard = () => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [pincodeFilter, setPincodeFilter] = useState("");

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await api.get(`/admin/vendors`);

                if (Array.isArray(res.data.data)) {
                    setVendors(res.data.data);
                    setFilteredVendors(res.data.data);
                } else {
                    console.warn("Expected an array but got:", res.data.data);
                    setVendors([]);
                    setFilteredVendors([]);
                }
            } catch (err) {
                console.error("Error fetching vendors:", err);
                setVendors([]);
                setFilteredVendors([]);
            }
        };

        fetchVendors();
    }, []);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setPincodeFilter(value);

        if (value.trim() === "") {
            setFilteredVendors(vendors);
        } else {
            const filtered = vendors.filter((vendor) =>
                vendor.serviceablePincodes?.some((pincode) =>
                    pincode.toString().includes(value.trim())
                )
            );
            setFilteredVendors(filtered);
        }
    };

    const handleClearFilter = () => {
        setPincodeFilter("");
        setFilteredVendors(vendors);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">Vendor Management</h2> */}

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Filter by Serviceable Pincode..."
                        value={pincodeFilter}
                        onChange={handleFilterChange}
                        className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
                    {pincodeFilter && (
                        <FiXCircle
                            onClick={handleClearFilter}
                            className="absolute top-2.5 right-3 text-gray-500 cursor-pointer hover:text-red-500"
                        />
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="sticky top-0 bg-blue-50 text-blue-900 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3">Vendor Name</th>
                            <th className="px-6 py-3">Press Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Serviceable Pincodes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendors.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                                    No matching vendors found.
                                </td>
                            </tr>
                        ) : (
                            filteredVendors.map((vendor, index) => (
                                <tr
                                    key={vendor._id}
                                    className={`border-t ${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100 transition`}
                                >
                                    <td className="px-6 py-3">{vendor.name}</td>
                                    <td className="px-6 py-3">{vendor.pressName}</td>
                                    <td className="px-6 py-3">{vendor.email}</td>
                                    <td className="px-6 py-3">{vendor.phone}</td>
                                    <td className="px-6 py-3">{vendor.address}</td>
                                    <td className="px-6 py-3 text-gray-700 text-sm">
                                        {vendor.serviceablePincodes?.join(", ") || "N/A"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminVendorDashboard;
