import { createApiClient } from "./client";

const API = createApiClient(import.meta.env.VITE_API_UR_auth);

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

export const registerUser = async (data) => (await API.post("/register", data)).data;
export const loginUser = async (data) => (await API.post("/login", data)).data;
export const googleLoginUser = (credential) =>
  API.post("/google-login", { credential }).then((res) => res.data);
export const verifyEmail = (token) => API.get(`/verify/${token}`).then((res) => res.data);
export const forgotPassword = (data) => API.post("/forgot-password", data).then((res) => res.data);
export const resetPassword = (token, data) =>
  API.post(`/reset-password/${token}`, data).then((res) => res.data);

// ------------------------
// Dashboard APIs
// ------------------------
export const getDashboardData = () => API.get("/dashboard").then((res) => res.data);
export const updateWater = (amount) => API.put("/water", { amount }).then((res) => res.data);
export const addTodo = (text) => API.post("/todos", { text }).then((res) => res.data);
export const toggleTodo = (id) => API.put(`/todos/${id}`).then((res) => res.data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`).then((res) => res.data);
export  function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
