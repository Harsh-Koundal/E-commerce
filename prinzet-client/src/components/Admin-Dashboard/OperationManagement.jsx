import { useState, useRef } from "react";
import { Shield, Workflow, BarChart3, Plus, Edit2, Trash2, Check, X } from "lucide-react";

import OperationAnalyticsForAdmin from "../charts/OperationAnalyticsForAdmin";

const OperationManagement = () => {
  const [policies, setPolicies] = useState([
    { id: 1, name: "Refund Policy", description: "Refunds allowed within 7 days." },
    { id: 2, name: "Return Policy", description: "Returns accepted within 14 days." },
    { id: 3, name: "Cancellation Policy", description: "Orders can be cancelled within 24 hours." },
  ]);

  const [newPolicy, setNewPolicy] = useState({ name: "", description: "" });
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState({ name: "", description: "" });

  const analyticsRef = useRef(null);

  const handleScrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddPolicy = () => {
    if (!newPolicy.name || !newPolicy.description) return;
    setPolicies([...policies, { id: policies.length + 1, ...newPolicy }]);
    setNewPolicy({ name: "", description: "" });
  };

  const handleDeletePolicy = (id) => {
    setPolicies(policies.filter((policy) => policy.id !== id));
  };

  const handleEditPolicy = (policy) => {
    setEditingPolicyId(policy.id);
    setEditingPolicy({ name: policy.name, description: policy.description });
  };

  const handleSaveEdit = (id) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === id ? { ...policy, ...editingPolicy } : policy
      )
    );
    setEditingPolicyId(null);
    setEditingPolicy({ name: "", description: "" });
  };

  const handleCancelEdit = () => {
    setEditingPolicyId(null);
    setEditingPolicy({ name: "", description: "" });
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Operation Management</h2>

      {/* Workflow & Efficiency */}
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Workflow className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">Workflow & Efficiency</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Monitor overall workflow and operational efficiency. Identify bottlenecks and optimize processes.
        </p>
        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition" onClick={handleScrollToAnalytics}>
          View Workflow
        </button>
      </div>

      {/* Policies Management */}
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900">Policies & Compliance</h3>
        </div>

        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              {editingPolicyId === policy.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editingPolicy.name}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={editingPolicy.description}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{policy.name}</h4>
                  <p className="text-gray-600 text-sm">{policy.description}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2 md:mt-0">
                {editingPolicyId === policy.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(policy.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md flex items-center gap-1 hover:bg-green-600 transition"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md flex items-center gap-1 hover:bg-gray-400 transition"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditPolicy(policy)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-md flex items-center gap-1 hover:bg-yellow-500 transition"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center gap-1 hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-medium mb-2 text-gray-800">Add New Policy</h4>
            <input
              type="text"
              placeholder="Policy Name"
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Policy Description"
              value={newPolicy.description}
              onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddPolicy}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              <Plus className="w-4 h-4" /> Add Policy
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow">
        <div ref={analyticsRef} className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900">Operational Analytics</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Track KPIs like orders processed, successful deliveries, returns, and cancellations.
        </p>
        <div>
          <OperationAnalyticsForAdmin />
        </div>
      </div>
    </div>
  );
};

export default OperationManagement;
