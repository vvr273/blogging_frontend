import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_blog;

const authConfig = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

const normalizePaginated = (data) => {
  if (Array.isArray(data)) {
    return {
      items: data,
      page: 1,
      limit: data.length || 1,
      total: data.length,
      totalPages: 1,
    };
  }
  return {
    items: data?.items || [],
    page: data?.page || 1,
    limit: data?.limit || 1,
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
  };
};

export const fetchBlogs = async ({ page = 1, limit = 12 } = {}) => {
  const res = await axios.get(`${API_URL}/all`, { params: { page, limit } });
  return normalizePaginated(res.data);
};

export const fetchMyBlogs = async ({ page = 1, limit = 12 } = {}) => {
  const res = await axios.get(`${API_URL}/my`, {
    ...authConfig(),
    params: { page, limit },
  });
  return normalizePaginated(res.data);
};

export const fetchTrendingBlogs = async () => {
  const res = await axios.get(`${API_URL}/trending`);
  return Array.isArray(res.data) ? res.data : res.data.items || [];
};

export const fetchBlog = async (id, { page = 1, limit = 20, cursor } = {}) => {
  const config = authConfig();
  config.params = { page, limit };
  if (cursor) config.params.cursor = cursor;
  const res = await axios.get(`${API_URL}/${id}`, config);
  return res.data;
};

export const createBlog = async (blog) => {
  const res = await axios.post(API_URL, blog, authConfig());
  return res.data;
};

export const updateBlog = async (id, blog) => {
  const res = await axios.put(`${API_URL}/${id}`, blog, authConfig());
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authConfig());
  return res.data;
};

export const toggleLike = async (id) => {
  const res = await axios.put(`${API_URL}/${id}/like`, {}, authConfig());
  return res.data;
};

export const addComment = async (blogId, text) => {
  const res = await axios.post(
    `${API_URL}/${blogId}/comments`,
    { text },
    authConfig()
  );
  return res.data;
};

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
