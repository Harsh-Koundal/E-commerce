import React from "react";

const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Super Admin Settings</h2>

      {/* System-Level Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System-Level Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Application Name</label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" defaultValue="Printzet" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Currency</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save System Settings</button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Access</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
            <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" defaultValue={30} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="h-4 w-4 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</label>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Security Settings</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>SMS Notifications</span>
            <input type="checkbox" className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Notifications</button>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stripe API Key</label>
            <input type="password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="sk_test_*********" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Analytics Key</label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="UA-123456-1" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Integrations</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
