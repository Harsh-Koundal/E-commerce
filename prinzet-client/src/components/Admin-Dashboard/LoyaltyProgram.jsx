import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Settings,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  Award,
} from "lucide-react";
const LoyaltyProgram = () => {
  const API_BASE_URL =
    import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "/api" ||
    "http://localhost:5020/api";

  // Get auth token from localStorage or context
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // API Headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  });

  // Loyalty Program Component
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return Promise.reject(error);
    }
  );

  const [tiers, setTiers] = useState([]);
  const [rules, setRules] = useState([]);
  const [loyaltyUsers, setLoyaltyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newTier, setNewTier] = useState({
    name: "",
    range: "",
    benefits: "",
  });

  const [newRule, setNewRule] = useState({
    title: "",
    details: "",
  });

  const [selectedUser, setSelectedUser] = useState("");
  const [userLoyaltyData, setUserLoyaltyData] = useState(null);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  const loyaltyService = {
    async getAllLoyalty() {
      try {
        const response = await api.get("/loyalty");
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch loyalty data"
        );
      }
    },

    async addOrUpdateLoyalty(data) {
      try {
        const response = await api.post("/loyalty", data);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to save loyalty data"
        );
      }
    },

    async getLoyaltyByUser(userId) {
      try {
        const response = await api.get(`loyalty/${userId}`);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch user loyalty data"
        );
      }
    },

    async deleteLoyalty(userId) {
      try {
        const response = await api.delete(`loyalty/${userId}`);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to delete loyalty data"
        );
      }
    },
  };
  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await loyaltyService.getAllLoyalty();

      if (data && Array.isArray(data) && data.length > 0) {
        const loyaltyConfig = data[0];
        setTiers(loyaltyConfig.tiers || []);
        setRules(loyaltyConfig.rules || []);
        setLoyaltyUsers(data);
      } else if (data && !Array.isArray(data)) {
        setTiers(data.tiers || []);
        setRules(data.rules || []);
        setLoyaltyUsers([data]);
      } else {
        setTiers([]);
        setRules([]);
        setLoyaltyUsers([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading loyalty data:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveLoyaltyProgram = async () => {
    try {
      setLoading(true);
      setError("");

      const loyaltyData = {
        tiers,
        rules,
        updatedAt: new Date().toISOString(),
        version: "1.0",
      };

      await loyaltyService.addOrUpdateLoyalty(loyaltyData);
      setSuccess("Loyalty program saved successfully!");

      await loadLoyaltyData();
    } catch (err) {
      setError(err.message);
      console.error("Error saving loyalty program:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTier = async () => {
    if (!newTier.name || !newTier.range) {
      setError("Please fill in tier name and range");
      return;
    }

    const tier = {
      id: Date.now().toString(),
      name: newTier.name.trim(),
      range: newTier.range.trim(),
      benefits: newTier.benefits
        ? newTier.benefits
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b.length > 0)
        : [],
      createdAt: new Date().toISOString(),
    };

    const updatedTiers = [...tiers, tier];
    setTiers(updatedTiers);
    setNewTier({ name: "", range: "", benefits: "" });
    setError("");

    try {
      const loyaltyData = {
        tiers: updatedTiers,
        rules,
        updatedAt: new Date().toISOString(),
      };
      await loyaltyService.addOrUpdateLoyalty(loyaltyData);
      setSuccess("Tier added successfully!");
    } catch (err) {
      setError(err.message);

      setTiers(tiers);
    }
  };

  const deleteTier = async (tierId) => {
    const originalTiers = [...tiers];
    const updatedTiers = tiers.filter((tier) => tier.id !== tierId);
    setTiers(updatedTiers);

    try {
      const loyaltyData = {
        tiers: updatedTiers,
        rules,
        updatedAt: new Date().toISOString(),
      };
      await loyaltyService.addOrUpdateLoyalty(loyaltyData);
      setSuccess("Tier deleted successfully!");
    } catch (err) {
      setError(err.message);

      setTiers(originalTiers);
    }
  };

  const addRule = async () => {
    if (!newRule.title) {
      setError("Please fill in rule title");
      return;
    }

    const rule = {
      id: Date.now().toString(),
      title: newRule.title.trim(),
      details: newRule.details
        ? newRule.details
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0)
        : [],
      createdAt: new Date().toISOString(),
    };

    const updatedRules = [...rules, rule];
    setRules(updatedRules);
    setNewRule({ title: "", details: "" });
    setError("");

    try {
      const loyaltyData = {
        tiers,
        rules: updatedRules,
        updatedAt: new Date().toISOString(),
      };
      await loyaltyService.addOrUpdateLoyalty(loyaltyData);
      setSuccess("Rule added successfully!");
    } catch (err) {
      setError(err.message);

      setRules(rules);
    }
  };

  const deleteRule = async (ruleId) => {
    const originalRules = [...rules];
    const updatedRules = rules.filter((rule) => rule.id !== ruleId);
    setRules(updatedRules);

    try {
      const loyaltyData = {
        tiers,
        rules: updatedRules,
        updatedAt: new Date().toISOString(),
      };
      await loyaltyService.addOrUpdateLoyalty(loyaltyData);
      setSuccess("Rule deleted successfully!");
    } catch (err) {
      setError(err.message);

      setRules(originalRules);
    }
  };

  const getUserLoyalty = async () => {
    if (!selectedUser.trim()) {
      setError("Please enter a user ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userData = await loyaltyService.getLoyaltyByUser(
        selectedUser.trim()
      );
      setUserLoyaltyData(userData);
      setSuccess(`User loyalty data loaded for user: ${selectedUser}`);
      console.log("User loyalty data:", userData);
    } catch (err) {
      setError(err.message);
      setUserLoyaltyData(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserLoyalty = async (userId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete loyalty data for user: ${userId}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await loyaltyService.deleteLoyalty(userId);
      setSuccess(`Loyalty data deleted for user: ${userId}`);

      setLoyaltyUsers((prev) => prev.filter((user) => user.userId !== userId));

      if (userLoyaltyData && userLoyaltyData.userId === userId) {
        setUserLoyaltyData(null);
      }

      await loadLoyaltyData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Loyalty Program Management
        </h1>
        <p className="text-gray-600">
          Manage loyalty tiers, rules, and user data with real-time API
          integration
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Award size={20} />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings size={24} />
          Control Panel
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={loadLoyaltyData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>

          <button
            onClick={saveLoyaltyProgram}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Manual Save"}
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="User ID"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, getUserLoyalty)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={getUserLoyalty}
              disabled={loading}
              className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Get User Loyalty Data"
            >
              <Users size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* User Loyalty Data Display */}
      {userLoyaltyData && (
        <div className="bg-blue-50 p-6 rounded-xl border">
          <h3 className="text-lg font-bold mb-3">User Loyalty Data</h3>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto">
            {JSON.stringify(userLoyaltyData, null, 2)}
          </pre>
        </div>
      )}

      {/* Tiers Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-4">
          Loyalty Tiers ({tiers.length})
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-indigo-700">{tier.name}</h3>
                <button
                  onClick={() => deleteTier(tier.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100"
                  title="Delete Tier"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {tier.range} Points
              </p>
              {tier.benefits && tier.benefits.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic mt-2">
                  No benefits specified
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Tier */}
        <div className="bg-gray-50 mt-6 p-4 rounded-xl border">
          <h4 className="font-semibold mb-3">Add New Tier</h4>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Tier Name (e.g. Diamond)"
              value={newTier.name}
              onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
              onKeyPress={(e) => handleKeyPress(e, addTier)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Range (e.g. 2000+)"
              value={newTier.range}
              onChange={(e) =>
                setNewTier({ ...newTier, range: e.target.value })
              }
              onKeyPress={(e) => handleKeyPress(e, addTier)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Benefits (comma separated)"
              value={newTier.benefits}
              onChange={(e) =>
                setNewTier({ ...newTier, benefits: e.target.value })
              }
              onKeyPress={(e) => handleKeyPress(e, addTier)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addTier}
            disabled={loading || !newTier.name || !newTier.range}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} /> Add Tier
          </button>
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-4">
          Reward Rules ({rules.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-green-700">{rule.title}</h3>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100"
                  title="Delete Rule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {rule.details && rule.details.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
                  {rule.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic mt-2">
                  No details specified
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add New Rule */}
        <div className="bg-gray-50 mt-6 p-4 rounded-xl border">
          <h4 className="font-semibold mb-3">Add New Rule</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Rule Title (e.g. Earn Points)"
              value={newRule.title}
              onChange={(e) =>
                setNewRule({ ...newRule, title: e.target.value })
              }
              onKeyPress={(e) => handleKeyPress(e, addRule)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Details (comma separated)"
              value={newRule.details}
              onChange={(e) =>
                setNewRule({ ...newRule, details: e.target.value })
              }
              onKeyPress={(e) => handleKeyPress(e, addRule)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addRule}
            disabled={loading || !newRule.title}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-4">
          User Management ({loyaltyUsers.length})
        </h2>

        {loyaltyUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">User ID</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Last Updated</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loyaltyUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-sm">
                      {user.userId || user.id || `User ${index + 1}`}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          deleteUserLoyalty(
                            user.userId || user.id || `user${index + 1}`
                          )
                        }
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-100"
                        title="Delete User Loyalty Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No loyalty users found</p>
            <p className="text-sm">
              Users will appear here after loyalty program interactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram