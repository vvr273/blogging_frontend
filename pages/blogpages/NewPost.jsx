import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor"; 
import { createBlog } from "../../src/api/blogs";
import image4 from "../images/image4.jpg"; 
import "./NewPost.css";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter a Title and content.");
      return;
    }

    setLoading(true);
    try {
      await createBlog(
        {
          title,
          content,
          description,
          tags: tags.split(",").map((t) => t.trim()),
          category,
        },
        token
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-layout">
      {/* 1. TOP BAR (Fixed) */}
      <nav className="editor-nav">
        <div className="nav-left">
          <button onClick={() => navigate(-1)} className="nav-back-btn">
            &larr; Dashboard
          </button>
        </div>
        <div className="nav-center">
          <span className="nav-draft-status">
            {title ? `Drafting: ${title.substring(0, 20)}...` : "New Story"}
          </span>
        </div>
        <div className="nav-right">
          <button 
            className="publish-btn" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </nav>

      <div className="workspace-grid">
        {/* 2. WRITING CANVAS (Scrollable) */}
        <main className="writing-canvas">
          <div className="canvas-limit">
            <input
              type="text"
              placeholder="Title of your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="ghost-title-input"
              autoFocus
            />
            
            {/* Direct Editor Mounting - No extra wrapper */}
            <div className="editor-wrapper">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>
        </main>

        {/* 3. SETTINGS SIDEBAR (Fixed Right) */}
        <aside className="meta-sidebar">
          <div 
            className="sidebar-visual"
            style={{ backgroundImage: `url(${image4})` }}
          >
            <div className="glass-overlay">
              <h3 className="sidebar-heading">Publishing Details</h3>
              
              <div className="input-group">
                <label>Category</label>
                <div className="select-wrapper">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input"
                  >
                    <option value="" disabled>Select topic...</option>
                    <option value="Tech">Technology</option>
                    <option value="Life">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Coding">Coding</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Excerpt</label>
                <textarea
                  placeholder="A short summary..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input textarea-glass"
                  maxLength={160}
                />
                <span className="char-count">{description.length}/160</span>
              </div>

              <div className="input-group">
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="react, api, web"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}