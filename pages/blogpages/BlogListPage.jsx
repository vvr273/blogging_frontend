import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogContext } from "../../src/context/BlogContext";
import image1 from "../images/image1.jpg";

export default function BlogListPage() {
  const { blogs } = useContext(BlogContext);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: `url(${image1})` }}
    >
      <h1 className="text-4xl text-white mb-8">All Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link
            to={`/blogs/${blog._id}`}
            key={blog._id}
            className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-gray-700 mt-2 line-clamp-3">{blog.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
