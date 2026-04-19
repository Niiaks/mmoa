import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// List of routes that should NOT trigger global 401 handling
const PUBLIC_ROUTES = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/me",
];

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    if (error.response?.status === 401) {
      // Skip global handling for public/auth routes
      const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));

      if (isPublicRoute) {
        return Promise.reject(error);
      }

      toast.error("Session expired. Please log in again.");

      // Redirect to login
      window.location.href = "/";
    }

    // You can extend this for other status codes later
    return Promise.reject(error);
  },
);

export default api;
