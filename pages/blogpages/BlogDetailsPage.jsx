import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { BlogContext } from "../../src/context/BlogContext";
import image2 from "../images/image2.jpg";

export default function BlogDetailsPage() {
  const { selectedBlog, loadBlog } = useContext(BlogContext);
  const { id } = useParams();

  useEffect(() => {
    loadBlog(id);
  }, [id]);

  if (!selectedBlog) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: `url(${image2})` }}
    >
      <div className="bg-white p-10 rounded-lg max-w-3xl mx-auto shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{selectedBlog.title}</h1>
        <p className="text-gray-800">{selectedBlog.content}</p>
        <p className="text-gray-500 mt-4">
          Author: {selectedBlog.author.name}
        </p>
      </div>
    </div>
  );
}
