// UserManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, Eye, Edit, Trash2, X,Clock } from "lucide-react";
import api from "@/lib/api";



export default function UserManagement() {
  const sampleLogs = [
    {
      action: "Resolved Query",
      createdAt: "2025-10-02T09:30:00Z",
      details: "Responded to customer complaint about delayed delivery for Order #ORD1024.",
    },
    {
      action: "Updated Order Status",
      createdAt: "2025-10-02T11:00:00Z",
      details: "Changed Order #ORD1055 status from 'Processing' to 'Shipped'.",
    },
    {
      action: "Supply Coordination",
      createdAt: "2025-10-02T12:30:00Z",
      details: "Confirmed stock availability with warehouse for Product SKU-4321.",
    },
    {
      action: "Customer Follow-up",
      createdAt: "2025-10-02T14:00:00Z",
      details: "Called customer to confirm delivery address for Order #ORD1098.",
    },
    {
      action: "Escalated Issue",
      createdAt: "2025-10-02T15:15:00Z",
      details: "Escalated high-priority issue with supplier regarding delayed shipment of raw materials.",
    },
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "employee",
    status: "Active",
    joinDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/operation/users`);
        setUsers(res.data?.data.users || []);
      } catch (error) {
        console.error(
          "Error fetching users:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Create new user
  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/operation/users", formData);

      const newUser = res.data?.data?.user;
      if (newUser) {
        setUsers((prev) => (Array.isArray(prev) ? [...prev, newUser] : [newUser]));
      }

      // Reset and close form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);

    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
    }
  };

  // Edit user
  const editUser = async (userId, updates) => {
    try {
      console.log("Editing user:", userId, updates);
      // const res = await api.put(`/admin/operation/users/${userId}`, updates);
      //mocking the api 
      const res = { data: { data: { ...updates, _id: userId } } };
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data?.data : u))
      );
    } catch (error) {
      console.error("Error editing user:", error.response?.data || error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/operation/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  // View user logs
  const viewUserLogs = async (userId) => {
    try {
      const res = await api.get(`/admin/user-logs/${userId}`);
      console.log("User logs:", res.data?.data || sampleLogs);
      // setLogs(res.data?.data || sampleLogs);
    } catch (error) {
      console.error("Error fetching user logs:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {showForm && <Adduser {...{ addUser, setShowForm, formData, handleChange }} />}
      {showLogs && <UserLogsModal logs={sampleLogs} setShowLogs={setShowLogs} />}

      {/* table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className=" flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading users...</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{user.fullName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.isEmployee ? "employee" : "admin"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === "Active" || 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.joinDate || "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => setShowLogs(true)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => editUser()}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteUser(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}



const Adduser = ({ addUser, setShowForm, formData, handleChange }) => {
  return (<>
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add New Employee</h3>
          <button onClick={() => setShowForm(false)}>
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={addUser} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Save User
          </button>
        </form>
      </div>
    </div>
  </>
  )
}


const UserLogsModal = ({ logs, setShowLogs }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Employee Activity Logs</h3>
          <button onClick={() => setShowLogs(false)}>
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Timeline */}
        {logs.length > 0 ? (
          <div className="relative border-l border-gray-300 pl-6">
            {logs.map((log, index) => (
              <div key={index} className="mb-6 relative">
                {/* Circle dot */}
                <span className="absolute -left-3 top-1.5 w-3 h-3 bg-blue-600 rounded-full border border-white"></span>

                {/* Log Content */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{log.action}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No logs found for this employee.</p>
        )}
      </div>
    </div>
  );
}