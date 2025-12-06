import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiXCircle } from "react-icons/fi";

const AdminUserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userIdFilter, setUserIdFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data.data);
                setFilteredUsers(res.data.data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setUserIdFilter(value);

        if (value.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) =>
                user._id.toLowerCase().includes(value.trim().toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const handleClearFilter = () => {
        setUserIdFilter("");
        setFilteredUsers(users);
    };

    if (loading) return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
    if (error) return <div className="p-6 bg-gray-100 min-h-screen text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by User ID..."
                        value={userIdFilter}
                        onChange={handleFilterChange}
                        className="w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
                    {userIdFilter && (
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
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Is Admin</th>
                            <th className="px-6 py-3">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                                    No matching users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                                >
                                    <td className="px-6 py-3">{user._id}</td>
                                    <td className="px-6 py-3">{user.fullName}</td>
                                    <td className="px-6 py-3">{user.email}</td>
                                    <td className="px-6 py-3">
                                        {user.address ? (
                                            <>
                                                <p>{user.address.address}</p>
                                                <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">Address not available</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-3">{user.isAdmin ? "Yes" : "No"}</td>
                                    <td className="px-6 py-3">{new Date(user.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserDashboard;
