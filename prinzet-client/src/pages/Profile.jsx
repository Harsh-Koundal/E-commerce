import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData, updateData, postData } from "@/lib/api";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });

  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getData("/auth/user/profile");
        // Fetch address list
        const addresses = await getData("/auth/user/address");
        
        if (!profileData || !profileData.email) {
          // No valid profile data, redirect to login
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        
        setAddressList(addresses || []);
        setUser(profileData);
        setEditData({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          mobile: profileData.mobile || "",
        });
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateData("/auth/user/profile", editData);
      toast.success("Profile updated successfully!");
      setUser(editData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await postData("/auth/user/address", newAddress);
      toast.success("Address added successfully!");
      setAddressList([...addressList, newAddress]);
      setNewAddress({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Profile
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : user ? (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center text-xl font-bold rounded-full">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {user.fullName}
                  </p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <form
                onSubmit={handleProfileUpdate}
                className="p-4 bg-gray-100 rounded-lg space-y-3"
              >
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={(e) =>
                    setEditData({ ...editData, fullName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Full Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  name="mobile"
                  value={editData.mobile}
                  onChange={(e) =>
                    setEditData({ ...editData, mobile: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Mobile Number"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Update Profile
                </button>
              </form>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Addresses</h3>
              {addressList.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {addressList.map((addr, idx) => (
                    <li key={idx}>
                      {addr.address}, {addr.city}, {addr.state}, {addr.pincode}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No addresses found.</p>
              )}

              <form
                onSubmit={handleAddAddress}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="State"
                  required
                />
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="Pincode"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-1 md:col-span-2"
                >
                  Add
                </button>
              </form>
            </div>

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Order History
            </button>
          </>
        ) : (
          <p className="text-center text-red-500">User not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
