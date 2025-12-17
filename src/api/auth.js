// frontend/src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_UR_auth,
});

// Add token automatically for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------------
// Auth & User APIs
// ------------------------
export const getUserFromToken = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const googleLoginUser = (credential) =>
  API.post("/google-login", { credential });
export const verifyEmail = (token) => API.get(`/verify/${token}`);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resetPassword = (token, data) =>
  API.post(`/reset-password/${token}`, data);

// ------------------------
// Dashboard APIs
// ------------------------
export const getDashboardData = () => API.get("/dashboard");
export const updateWater = (amount) => API.put("/water", { amount });
export const addTodo = (text) => API.post("/todos", { text });
export const toggleTodo = (id) => API.put(`/todos/${id}`);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export  function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

