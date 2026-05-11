import { createApiClient } from "./client";

const API_URL = import.meta.env.VITE_API_URL_profile;
const API = createApiClient(API_URL);

export const fetchProfile = async () => {
  const res = await API.get("/");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/", data);
  return res.data;
};

export const deleteOwnBlogFromProfile = async (id) => (await import("./blogs")).deleteBlog(id);
