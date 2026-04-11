import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Automatically logging out...");
      sessionStorage.removeItem("user");
      window.location.href = "/login?session_expired=true";
    }
    return Promise.reject(error);
  },
);

export default api;
