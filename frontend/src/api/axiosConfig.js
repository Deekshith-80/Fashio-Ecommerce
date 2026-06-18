import axios from "axios";

const axiosInstance = axios.create({
  // Your live Vercel backend URL
  baseURL: "https://fashio-ecommerce.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
