import React, { useState, useEffect } from "react";
import { BlogContext } from "./BlogContext.jsx";
import {
  fetchBlogs,
  fetchBlog,
//   fetchMyBlogs,
  createBlog as apiCreateBlog,
  updateBlog as apiUpdateBlog,
  deleteBlog as apiDeleteBlog,
} from "../api/blogs.js";

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const token = localStorage.getItem("token");

  const loadBlogs = async () => {
    const data = await fetchBlogs();
    setBlogs(data);
  };

  const loadBlog = async (id) => {
    const data = await fetchBlog(id);
    setSelectedBlog(data);
  };

  const createBlog = async (blog) => {
    const data = await apiCreateBlog(blog, token);
    setBlogs([data, ...blogs]);
    return data;
  };

  const updateBlog = async (id, blog) => {
    const data = await apiUpdateBlog(id, blog, token);
    setBlogs(blogs.map((b) => (b._id === id ? data : b)));
    return data;
  };

  const deleteBlog = async (id) => {
    await apiDeleteBlog(id, token);
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        selectedBlog,
        loadBlog,
        createBlog,
        updateBlog,
        deleteBlog,
        token
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
