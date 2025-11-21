import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const ProductManagement = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    status: "pending",
  });
  const [editingService, setEditingService] = useState(null);

  const token = localStorage.getItem("vendorToken");

  // Fetch services
  const fetchServices = async () => {
    try {
      if (!token) return;
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data)
      setServices(res.data?.services || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
      status: service.status || "pending",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) return;

      if (editingService) {
        await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/${editingService._id}`,
          newService,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Service updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor`,
          newService,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Service added successfully");
      }
      await fetchServices();
      setShowForm(false);
      setNewService({ name: "", description: "", price: "", status: "pending" });
      setEditingService(null);
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error("Failed to save service");
    }
  };

  const deleteService = async (id) => {
    try {
      if (!token) return;
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vendor/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Service deleted successfully");
      fetchServices(); 
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Service Management</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setEditingService(null);
            setNewService({ name: "", description: "", price: "", status: "pending" });
            setShowForm(true);
          }}
        >
          <PlusCircle className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Service Name"
                className="w-full border px-3 py-2 rounded"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={newService.status}
                onChange={(e) => setNewService({ ...newService, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingService ? "Update" : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services && services.length > 0 ? (
              services.map((s, index) => (
                <tr key={s._id || index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{s.name || "No Name"}</td>
                  <td className="px-4 py-2">₹{s.price || 0}</td>
                  <td className="px-4 py-2">
                    <Badge
                      className={`${
                        s.status === "approved"
                          ? "bg-green-500"
                          : s.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {s.status || "unknown"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(s)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => s._id && deleteService(s._id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
