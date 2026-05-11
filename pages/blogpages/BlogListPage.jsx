import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../src/api/blogs";
import image1 from "../images/image1.jpg";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogs({ page, limit: 12 });
        setBlogs(data.items || []);
        setTotalPages(data.totalPages || 1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: `url(${image1})` }}
    >
      <h1 className="text-4xl text-white mb-8">All Blogs</h1>
      {loading && <p className="text-white mb-4">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-gray-700 mt-2 line-clamp-3">{blog.content}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <button
          className="bg-white px-4 py-2 rounded disabled:opacity-60"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="text-white self-center">
          Page {page} / {totalPages}
        </span>
        <button
          className="bg-white px-4 py-2 rounded disabled:opacity-60"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
