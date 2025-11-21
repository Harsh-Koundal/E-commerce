import axios from "axios";


const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL+"/api"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");
  const token=userToken || vendorToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("GET error:", error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("POST error:", error);
    throw error;
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("PUT error:", error);
    throw error;
  }
};

export const deleteData = async (endpoint, data = {}) => {
  try {
    const response = await api.delete(endpoint, { data }); 
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("DELETE error:", error);
    throw error;
  }
};

export default api;



export const googleAuth = async (code) => api.get(`/auth/google?code=${code}`);

