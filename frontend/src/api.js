import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
