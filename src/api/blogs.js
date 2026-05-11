import { createApiClient } from "./client";

const API_URL = import.meta.env.VITE_API_URL_blog;
const API = createApiClient(API_URL);

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
  const res = await API.get("/all", { params: { page, limit } });
  return normalizePaginated(res.data);
};

export const fetchMyBlogs = async ({ page = 1, limit = 12 } = {}) => {
  const res = await API.get("/my", { params: { page, limit } });
  return normalizePaginated(res.data);
};

export const fetchTrendingBlogs = async () => {
  const res = await API.get("/trending");
  return Array.isArray(res.data) ? res.data : res.data.items || [];
};

export const fetchBlog = async (id, { page = 1, limit = 20, cursor } = {}) => {
  const config = { params: { page, limit } };
  if (cursor) config.params.cursor = cursor;
  const res = await API.get(`/${id}`, config);
  return res.data;
};

export const createBlog = async (blog) => {
  const res = await API.post("/", blog);
  return res.data;
};

export const updateBlog = async (id, blog) => {
  const res = await API.put(`/${id}`, blog);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

export const toggleLike = async (id) => {
  const res = await API.put(`/${id}/like`, {});
  return res.data;
};

export const addComment = async (blogId, text) => {
  const res = await API.post(`/${blogId}/comments`, { text });
  return res.data;
};

export const editComment = async (blogId, commentId, text) => {
  const res = await API.put(`/${blogId}/comments/${commentId}`, { text });
  return res.data;
};

export const deleteComment = async (blogId, commentId) => {
  const res = await API.delete(`/${blogId}/comments/${commentId}`);
  return res.data;
};
