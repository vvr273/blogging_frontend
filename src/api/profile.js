import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_profile;
const BLOG_API_URL = import.meta.env.VITE_API_URL_blog;

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchProfile = async (token) => {
  const res = await axios.get(API_URL, authHeaders(token));
  return res.data;
};

export const updateProfile = async (data, token) => {
  const res = await axios.put(API_URL, data, authHeaders(token));
  return res.data;
};

export const deleteOwnBlogFromProfile = async (id, token) => {
  const res = await axios.delete(`${BLOG_API_URL}/${id}`, authHeaders(token));
  return res.data;
};
