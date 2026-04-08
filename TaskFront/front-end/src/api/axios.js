import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Automatically logging out...");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login?session_expired=true";
    }
    return Promise.reject(error);
  },
);

export default api;
