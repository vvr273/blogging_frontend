import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlog, updateBlog } from "../../src/api/blogs";
import Editor from "../../components/Editor";
import "./EditBlog.css"; // We will create this

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await fetchBlog(id);

        // Authorization Check
        const isAuthor =
          user &&
          blog.author &&
          (blog.author._id === user._id || blog.author._id === user.id || 
           blog.author === user._id || blog.author === user.id);

        if (!isAuthor) {
          alert("❌ You are not authorized to edit this blog.");
          navigate(`/blog/${id}`);
          return;
        }

        setTitle(blog.title);
        setDescription(blog.description || "");
        setCategory(blog.category || "");
        setTags(blog.tags?.join(", ") || "");
        setContent(blog.content || "");
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to load blog");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, navigate]); // Removed 'user' from dependency to prevent loops

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedBlog = {
      title,
      description,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
      content,
    };

    try {
      await updateBlog(id, updatedBlog, token);
      // Optional: Add a toast notification here instead of alert
      navigate(`/blog/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Editor...</div>;

  return (
    <div className="editor-layout">
      {/* 1. STICKY HEADER (Actions) */}
      <header className="editor-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span className="status-text">Editing Mode</span>
        </div>
        <div className="header-right">
          <button 
            className="save-btn" 
            onClick={handleUpdate} 
            disabled={saving}
          >
            {saving ? "Publishing..." : "Update Changes"}
          </button>
        </div>
      </header>

      <div className="editor-grid">
        {/* 2. MAIN CANVAS (Title + Editor) */}
        <main className="editor-main">
          <input
            className="title-input"
            placeholder="Blog Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          
          <div className="editor-wrapper">
            <Editor value={content} onChange={setContent} />
          </div>
        </main>

        {/* 3. SETTINGS SIDEBAR (Metadata) */}
        <aside className="editor-sidebar">
          <div className="sidebar-card">
            <h3>Publishing Details</h3>
            
            <div className="form-group">
              <label>Short Description</label>
              <textarea
                className="sidebar-input textarea-sm"
                placeholder="What is this blog about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={150}
              />
              <small>{description.length}/150</small>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                className="sidebar-input"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select Category</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Coding">Coding</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                className="sidebar-input"
                placeholder="react, api, backend"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <small>Separate with commas</small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}