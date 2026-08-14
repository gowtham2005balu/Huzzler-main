import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://huzzler.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default API;
