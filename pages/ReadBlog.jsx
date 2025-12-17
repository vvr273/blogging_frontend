import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Trash2,
  Edit3,
  User,
  Clock,
  Send,
  X,
  Check
} from "lucide-react";
import "./ReadBlog.css";
const API_URL = import.meta.env.VITE_API_URL_blog;

// ---------------- UTILITIES ----------------
const calculateReadTime = (text) => {
  const wordsPerMinute = 200;
  const words = text ? text.split(/\s+/).length : 0;
  return `${Math.ceil(words / wordsPerMinute)} min read`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---------------- COMPONENT ----------------
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Engagement States
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  // Comment States
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);

  // Editing States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // ---------------- FETCH BLOG ----------------
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );

        setBlog(res.data);
        setLikesCount(res.data.likes.length);
        setComments(res.data.comments || []);

        if (currentUser) {
          setIsLiked(
            res.data.likes.includes(currentUser._id) ||
              res.data.likes.includes(currentUser.id)
          );
        }
      } catch {
        console.error("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, token, currentUser]);

  // ---------------- AUTHOR CHECK (For Blog Post) ----------------
  const isAuthor =
    currentUser &&
    blog?.author &&
    (blog.author._id === currentUser._id || blog.author._id === currentUser.id);

  // ---------------- LIKE ----------------
  const handleLike = async () => {
    if (!token) return alert("Please sign in to like this story.");

    const originalLiked = isLiked;
    const originalCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);

    try {
      await axios.put(
        `${API_URL}/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
    }
  };

  // ---------------- ADD COMMENT ----------------
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  // ---------------- DELETE COMMENT ----------------
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await axios.delete(
        `${API_URL}/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete comment");
    }
  };

  // ---------------- EDIT COMMENT LOGIC ----------------
  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await axios.put(
        `${API_URL}/${id}/comment/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to edit comment");
    }
  };

  // ---------------- DELETE BLOG ----------------
  const handleDeleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  if (!blog) return <div className="error-container">Blog not found.</div>;

  return (
    <div className="read-layout">
      <article className="blog-article">
        {/* Navigation Button */}
      {/* NEW - Let CSS handle the beauty */}
<button
  className="post-btn"
  onClick={() => navigate("/dashboard")}
>
  ← Home
</button>

        {/* HEADER SECTION */}
        <header className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <p className="blog-subtitle">{blog.description}</p>
          <div className="blog-meta">
            <div className="author-info">
              <div className="avatar-placeholder">
                {blog.author?.name?.charAt(0) || "A"}
              </div>
              <div className="meta-text">
                <span className="author-name">
                  {blog.author?.name || "Anonymous"}
                </span>
                <div className="meta-details">
                  <span>{formatDate(blog.createdAt)}</span>
                  <span className="dot">·</span>
                  <span className="read-time">
                    <Clock size={14} /> {calculateReadTime(blog.content)}
                  </span>
                </div>
              </div>
            </div>
            {isAuthor && (
              <div className="author-actions">
                <button
                  onClick={() => navigate(`/blogs/edit/${id}`)}
                  className="icon-btn edit"
                  title="Edit Story"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={handleDeleteBlog}
                  className="icon-btn delete"
                  title="Delete Story"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ENGAGEMENT BAR */}
        <div className="engagement-divider">
          <div className="engagement-stats">
            <button
              className={`like-button ${isLiked ? "liked" : ""} ${
                isLikeAnimating ? "animating" : ""
              }`}
              onClick={handleLike}
            >
              <Heart size={24} fill={isLiked ? "#e11d48" : "none"} />
              <span>{likesCount}</span>
            </button>
            <button
              className="comment-toggle"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle size={24} />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        {showComments && (
          <section className="comments-section" id="comments">
            <h3>Discussion ({comments.length})</h3>

            {/* INPUT AREA (Fixed at top of section) */}
            {token ? (
              <div className="comment-input-wrapper">
                <div className="current-user-avatar">
                  {currentUser?.name?.charAt(0) || "U"}
                </div>
                <div className="input-box">
                  <textarea
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                  />
                  <div className="input-actions">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="post-btn"
                    >
                      Post <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                Please login to join the conversation.
              </div>
            )}

            {/* SCROLLABLE LIST CONTAINER */}
            <div className="comments-list">
              {comments.length === 0 && (
                <div className="no-comments">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}

              {comments.map((c) => {
                // LOGIC: Who can do what?
                // 1. Is the current logged-in user the author of this comment?
                const isCommentAuthor =
                  currentUser &&
                  (c.user._id === currentUser._id ||
                    c.user._id === currentUser.id);

                // 2. Is the current logged-in user the author of the entire blog post?
                const isBlogAuthor =
                  currentUser &&
                  (blog.author._id === currentUser._id ||
                    blog.author._id === currentUser.id);

                const isEditing = editingCommentId === c._id;

                return (
                  <div key={c._id} className="comment-item">
                    <div className="comment-avatar">
                      {c.user?.name?.charAt(0) || <User size={16} />}
                    </div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>{c.user?.name || "User"}</strong>
                        <span className="comment-date">
                          {new Date(c.createdAt).toLocaleDateString()}
                          {c.editedAt && (
                            <span className="edited-tag"> (edited)</span>
                          )}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="edit-comment-box">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="edit-textarea"
                          />
                          <div className="edit-actions">
                            <button
                              onClick={() => handleSaveEdit(c._id)}
                              className="save-btn"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="cancel-btn"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{c.text}</p>
                      )}

                      <div className="comment-actions">
                        {/* EDIT: Only the person who wrote the comment can edit it */}
                        {isCommentAuthor && !isEditing && (
                          <button
                            onClick={() => startEditing(c)}
                            className="action-link edit"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                        )}

                        {/* DELETE: The comment writer OR the blog post author can delete it */}
                        {(isCommentAuthor || isBlogAuthor) && !isEditing && (
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            className="action-link delete"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}