import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

// -----------------------------------
// COMMON AUTH HEADER
// -----------------------------------
const authConfig = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

// -----------------------------------
// BLOG APIs
// -----------------------------------

// Get all blogs (Public)
export const fetchBlogs = async () => {
  const res = await axios.get(`${API_URL}/all`);
  return res.data;
};

// Get single blog (Public + Auth optional)
export const fetchBlog = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, authConfig());
  return res.data;
};

// Get my blogs (Protected)
export const fetchMyBlogs = async () => {
  const res = await axios.get(`${API_URL}/my`, authConfig());
  return res.data;
};

// Create blog
export const createBlog = async (blog) => {
  const res = await axios.post(API_URL, blog, authConfig());
  return res.data;
};

// Update blog
export const updateBlog = async (id, blog) => {
  const res = await axios.put(`${API_URL}/${id}`, blog, authConfig());
  return res.data;
};

// Delete blog
export const deleteBlog = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authConfig());
  return res.data;
};

// -----------------------------------
// LIKE APIs
// -----------------------------------
export const toggleLike = async (id) => {
  const res = await axios.post(`${API_URL}/${id}/like`, {}, authConfig());
  return res.data;
};

// -----------------------------------
// COMMENT APIs
// -----------------------------------
export const addComment = async (blogId, text) => {
  const res = await axios.post(
    `${API_URL}/${blogId}/comments`,
    { text },
    authConfig()
  );
  return res.data;
};

// export const editComment = async (blogId, commentId, text) => {
//   const res = await axios.put(
//     `${API_URL}/${blogId}/comments/${commentId}`,
//     { text },
//     authConfig()
//   );
//   return res.data;
// };

// export const deleteComment = async (blogId, commentId) => {
//   const res = await axios.delete(
//     `${API_URL}/${blogId}/comments/${commentId}`,
//     authConfig()
//   );
//   return res.data;
// };
export const editComment = async (blogId, commentId, text) => {
  const res = await axios.put(
    `${API_URL}/${blogId}/comment/${commentId}`, // Fixed path to match route
    { text },
    authConfig()
  );
  return res.data;
};

export const deleteComment = async (blogId, commentId) => {
  const res = await axios.delete(
    `${API_URL}/${blogId}/comment/${commentId}`, // Fixed path to match route
    authConfig()
  );
  return res.data;
};