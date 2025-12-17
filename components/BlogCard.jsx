import { Link, useNavigate } from "react-router-dom";
// Added FaHeart here
import { FaTrash, FaUserCircle, FaCalendarAlt, FaClock, FaHeart } from "react-icons/fa"; 
import "./BlogCard.css";

// --- 1. IMPORT IMAGES ---
import img1 from "../pages/images/image1.jpg";
import img2 from "../pages/images/image2.jpg";
import img3 from "../pages/images/image3.jpg";
import img4 from "../pages/images/image4.jpg";

const blogImages = [img1, img2, img3, img4];

// --- 2. HELPER FUNCTIONS ---
const getBlogImage = (id) => {
  if (!id) return blogImages[0];
  const charSum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return blogImages[charSum % blogImages.length];
};

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getReadTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200) + " min read";
};

export default function BlogCard({ blog, onDelete }) {
  if (!blog) return null;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  
  const isOwner = user && (
    (blog.author?._id === user._id) || 
    (blog.author === user._id) || 
    (blog.author?._id === user.id)
  );

  const plainText = stripHtml(blog.content);
  const readTime = getReadTime(plainText);
  const coverImage = getBlogImage(blog._id);
  
  // Calculate Likes (Defensive check)
  const likeCount = blog.likes ? blog.likes.length : 0;

  const handleCardClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <article className="card-container" onClick={handleCardClick}>
      
      {/* 3. VISUAL HEADER */}
      <div className="card-header">
        <img 
          src={coverImage} 
          alt={blog.title} 
          className="card-cover"
          loading="lazy" 
        />
        <div className="card-overlay"></div>
        <span className="category-badge">{blog.category || "General"}</span>
        
        {isOwner && (
          <button
            className="delete-icon-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevents card click when deleting
              onDelete(blog._id);
            }}
            title="Delete Blog"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* 4. CONTENT BODY */}
      <div className="card-body">
        <h3 className="card-title" title={blog.title}>
          {blog.title}
        </h3>
        
        <p className="card-excerpt">
          {plainText.slice(0, 100)}...
        </p>

        {/* 5. FOOTER METADATA */}
        <div className="card-footer">
          <div className="author-info">
            <FaUserCircle className="author-icon" />
            <span className="author-name">
              {blog.author?.name || "Author"}
            </span>
          </div>
          
          <div className="meta-info">
            <span className="meta-item" title="Published Date">
              <FaCalendarAlt size={10} /> {formatDate(blog.createdAt)}
            </span>
            
            <span className="meta-dot">•</span>
            
            <span className="meta-item" title="Read Time">
              <FaClock size={10} /> {readTime}
            </span>

            {/* --- NEW LIKE COUNT SECTION --- */}
            <span className="meta-dot">•</span>
            <span className="meta-item likes-item" title="Total Likes">
               <FaHeart size={10} className="heart-icon" /> {likeCount}
            </span>

          </div>
        </div>
      </div>
    </article>
  );
}