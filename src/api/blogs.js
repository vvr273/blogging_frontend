import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_blog;

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
export const fetchBlogs = async ({ page = 1, limit = 12 } = {}) => {
  const res = await axios.get(`${API_URL}/all`, {
    params: { page, limit },
  });
  if (Array.isArray(res.data)) {
    return {
      items: res.data,
      page: 1,
      limit: res.data.length,
      total: res.data.length,
      totalPages: 1,
    };
  }
  return res.data;
};

// Get single blog (Public + Auth optional)
export const fetchBlog = async (id, { page = 1, limit = 20 } = {}) => {
  const config = authConfig();
  config.params = { page, limit };
  const res = await axios.get(`${API_URL}/${id}`, config);
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
  const res = await axios.put(`${API_URL}/${id}/like`, {}, authConfig());
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
    `${API_URL}/${blogId}/comments/${commentId}`,
    { text },
    authConfig()
  );
  return res.data;
};

export const deleteComment = async (blogId, commentId) => {
  const res = await axios.delete(
    `${API_URL}/${blogId}/comments/${commentId}`,
    authConfig()
  );
  return res.data;
};
