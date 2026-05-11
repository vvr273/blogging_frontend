import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Trash2,
  Edit3,
  User,
  Clock,
  Send,
  X,
  Check,
} from "lucide-react";
import {
  addComment,
  deleteBlog,
  deleteComment,
  editComment,
  fetchBlog,
  toggleLike,
} from "../src/api/blogs";
import { toDisplayError } from "../src/api/client";
import "./ReadBlog.css";

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

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const [comments, setComments] = useState([]);
  const [nextCommentsCursor, setNextCommentsCursor] = useState(null);
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?._id || currentUser?.id || null;

  const hydrateFromBlog = (data, append = false) => {
    setBlog(data);
    setLikesCount(data.likes?.length || 0);
    const incoming = data.comments || [];
    setComments((prev) => (append ? [...prev, ...incoming] : incoming));

    const cursor = data.commentsPagination?.nextCursor || null;
    setNextCommentsCursor(cursor);

    if (currentUserId) {
      setIsLiked((data.likes || []).includes(currentUserId));
    }
  };

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBlog(id, { limit: 10 });
        if (!active) return;
        hydrateFromBlog(data, false);
      } catch (err) {
        if (!active) return;
        setError(toDisplayError(err));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitial();
    return () => {
      active = false;
    };
  }, [id, currentUserId]);

  const isAuthor = currentUserId && blog?.author && blog.author._id === currentUserId;

  const handleLike = async () => {
    if (!token) return alert("Please sign in to like this story.");

    const originalLiked = isLiked;
    const originalCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);

    try {
      await toggleLike(id);
    } catch {
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
    }
  };

  const handleLoadMoreComments = async () => {
    if (!nextCommentsCursor || commentsLoadingMore) return;
    setCommentsLoadingMore(true);
    try {
      const data = await fetchBlog(id, { limit: 10, cursor: nextCommentsCursor });
      hydrateFromBlog(data, true);
    } catch (err) {
      alert(toDisplayError(err));
    } finally {
      setCommentsLoadingMore(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const data = await addComment(id, commentText);
      hydrateFromBlog(data, false);
      setCommentText("");
    } catch (err) {
      alert(toDisplayError(err));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const data = await deleteComment(id, commentId);
      hydrateFromBlog(data, false);
    } catch (err) {
      alert(toDisplayError(err));
    }
  };

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
      const data = await editComment(id, commentId, editText);
      hydrateFromBlog(data, false);
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      alert(toDisplayError(err));
    }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await deleteBlog(id);
      navigate("/dashboard");
    } catch (err) {
      alert(toDisplayError(err));
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  if (error) return <div className="error-container">{error}</div>;
  if (!blog) return <div className="error-container">Blog not found.</div>;

  return (
    <div className="read-layout">
      <article className="blog-article">
        <button className="post-btn" onClick={() => navigate("/dashboard")}>← Home</button>

        <header className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <p className="blog-subtitle">{blog.description}</p>
          <div className="blog-meta">
            <div className="author-info">
              <div className="avatar-placeholder">{blog.author?.name?.charAt(0) || "A"}</div>
              <div className="meta-text">
                <span className="author-name">{blog.author?.name || "Anonymous"}</span>
                <div className="meta-details">
                  <span>{formatDate(blog.createdAt)}</span>
                  <span className="dot">·</span>
                  <span className="read-time"><Clock size={14} /> {calculateReadTime(blog.content)}</span>
                </div>
              </div>
            </div>
            {isAuthor && (
              <div className="author-actions">
                <button onClick={() => navigate(`/blogs/edit/${id}`)} className="icon-btn edit" title="Edit Story">
                  <Edit3 size={18} />
                </button>
                <button onClick={handleDeleteBlog} className="icon-btn delete" title="Delete Story">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="engagement-divider">
          <div className="engagement-stats">
            <button className={`like-button ${isLiked ? "liked" : ""} ${isLikeAnimating ? "animating" : ""}`} onClick={handleLike}>
              <Heart size={24} fill={isLiked ? "#e11d48" : "none"} />
              <span>{likesCount}</span>
            </button>
            <button className="comment-toggle" onClick={() => setShowComments(!showComments)}>
              <MessageCircle size={24} />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        {showComments && (
          <section className="comments-section" id="comments">
            <h3>Discussion ({comments.length})</h3>

            {token ? (
              <div className="comment-input-wrapper">
                <div className="current-user-avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                <div className="input-box">
                  <textarea
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                  />
                  <div className="input-actions">
                    <button onClick={handleAddComment} disabled={!commentText.trim()} className="post-btn">
                      Post <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login-prompt">Please login to join the conversation.</div>
            )}

            <div className="comments-list">
              {comments.length === 0 && (
                <div className="no-comments">No comments yet. Be the first to share your thoughts!</div>
              )}

              {comments.map((c) => {
                const commentUserId = c?.user?._id || null;
                const isCommentAuthor = currentUserId && commentUserId && commentUserId === currentUserId;
                const isBlogAuthor = currentUserId && blog.author._id === currentUserId;
                const isEditing = editingCommentId === c._id;

                return (
                  <div key={c._id} className="comment-item">
                    <div className="comment-avatar">{c.user?.name?.charAt(0) || <User size={16} />}</div>
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>{c.user?.name || "User"}</strong>
                        <span className="comment-date">
                          {new Date(c.createdAt).toLocaleDateString()}
                          {c.editedAt && <span className="edited-tag"> (edited)</span>}
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
                            <button onClick={() => handleSaveEdit(c._id)} className="save-btn">
                              <Check size={14} /> Save
                            </button>
                            <button onClick={cancelEditing} className="cancel-btn">
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{c.text}</p>
                      )}

                      <div className="comment-actions">
                        {isCommentAuthor && !isEditing && (
                          <button onClick={() => startEditing(c)} className="action-link edit">
                            <Edit3 size={14} /> Edit
                          </button>
                        )}

                        {(isCommentAuthor || isBlogAuthor) && !isEditing && (
                          <button onClick={() => handleDeleteComment(c._id)} className="action-link delete">
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {nextCommentsCursor && (
              <div className="input-actions" style={{ marginTop: "12px" }}>
                <button className="post-btn" onClick={handleLoadMoreComments} disabled={commentsLoadingMore}>
                  {commentsLoadingMore ? "Loading..." : "Load more comments"}
                </button>
              </div>
            )}
          </section>
        )}
      </article>
    </div>
  );
}
