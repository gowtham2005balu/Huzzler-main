// Centralized API Configuration for local & production
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://huzzler.onrender.com/api";

export const BACKEND_ROOT_URL =
  API_BASE_URL.replace(/\/api\/?$/, "");
