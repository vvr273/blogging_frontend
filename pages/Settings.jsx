import { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../src/api/profile.js";
import ThreeDButton from "../components/ThreeDButton";
import BlogCard from "../components/BlogCard"; // Importing your existing card
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' or 'liked'
  const [isEditing, setIsEditing] = useState(false); // Toggle between View and Edit mode
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
  });
  
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // --- 1. LOAD DATA ---
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const data = await fetchProfile(token);
        // Ensure we handle the structure (some backends return {user: ...} some return direct obj)
        const profileData = data.profile || data || data.user; 
        
        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          profileImage: profileData.profileImage || "",
        });
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  // --- 2. HANDLE UPDATES ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    try {
      const token = localStorage.getItem("token");
      const res = await updateProfile(formData, token);

      const updatedUser = res.user || res; 
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({ text: "Profile updated successfully!", type: "success" });
      
      // Optional: Switch back to view mode after short delay
      setTimeout(() => {
        setIsEditing(false);
        setMessage({ text: "", type: "" });
      }, 1500);

    } catch (err) {
      setMessage({ text: "Failed to update. Try again.", type: "error" });
    }
  };

  // --- 3. HANDLE DELETE (For Blog Cards) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        // Optimistic UI Update
        const updatedPosts = user.posts.filter(b => b._id !== id);
        setUser({ ...user, posts: updatedPosts });
        
    } catch (error) {
        alert("Failed to delete");
    }
  };

  if (isLoading) return <div style={styles.loading}>Loading Profile...</div>;

  // Helper to determine which list to show
  const displayList = activeTab === 'posts' ? (user?.posts || []) : (user?.likedPosts || []);

  return (
    <div style={styles.container}>
      {/* Back Navigation */}
      <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
        ← Back to Dashboard
      </button>

      <div style={styles.wrapper}>
        
        {/* --- PROFILE HEADER (ALWAYS VISIBLE) --- */}
        <div style={styles.header}>
            <div style={styles.avatarContainer}>
                {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" style={styles.avatar} />
                ) : (
                    <div style={styles.avatarPlaceholder}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                
                {/* THE EDIT PENCIL TRIGGER */}
                <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    style={{...styles.editBtn, background: isEditing ? '#EF4444' : '#4F46E5'}}
                    title={isEditing ? "Cancel Editing" : "Edit Profile"}
                >
                    {isEditing ? "✕" : "✎"}
                </button>
            </div>

            <h2 style={styles.name}>{user?.name}</h2>
            <p style={styles.handle}>@{user?.username}</p> {/* Username is READ ONLY here */}
            
            {/* Stats Row */}
            {!isEditing && (
                <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>{user?.posts?.length || 0}</span>
                        <span style={styles.statLabel}>Posts</span>
                    </div>
                    <div style={styles.statDivider} />
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>{user?.likedPosts?.length || 0}</span>
                        <span style={styles.statLabel}>Liked</span>
                    </div>
                </div>
            )}
        </div>

        {/* --- CONDITIONAL RENDER: EDIT FORM vs CONTENT TABS --- */}
        
        {isEditing ? (
            /* === EDIT MODE === */
            <div style={styles.formContainer}>
                <h3 style={styles.sectionTitle}>Edit Profile Details</h3>
                <form onSubmit={handleUpdate} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Display Name</label>
                        <input
                            style={styles.input}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Profile Image URL</label>
                        <input
                            style={styles.input}
                            value={formData.profileImage}
                            onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    {/* NOTE: Username input removed as requested */}

                    {message.text && (
                        <div style={{
                            ...styles.message,
                            background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                            color: message.type === 'success' ? '#166534' : '#991B1B'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={styles.actionRow}>
                        <ThreeDButton text="Save Updates" />
                    </div>
                </form>
            </div>
        ) : (
            /* === VIEW MODE (TABS & GRID) === */
            <div>
                <div style={styles.tabs}>
                    <button 
                        style={activeTab === 'posts' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('posts')}
                    >
                        My Blogs
                    </button>
                    <button 
                        style={activeTab === 'liked' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('liked')}
                    >
                        Liked Blogs
                    </button>
                </div>

                <div style={styles.gridContainer}>
                    {displayList.length > 0 ? (
                        <div className="blog-grid" style={styles.gridOverride}>
                             {displayList.map((blog) => (
                                <BlogCard 
                                    key={blog._id} 
                                    blog={blog} 
                                    onDelete={activeTab === 'posts' ? handleDelete : undefined} 
                                    // We disable delete button for 'liked' posts usually, 
                                    // or handle 'unlike' differently. 
                                />
                             ))}
                        </div>
                    ) : (
                        <div style={styles.emptyState}>
                            <p>No {activeTab} found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#F8FAFC", // Light gray background
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  wrapper: {
    maxWidth: "800px", // Wider to fit BlogCards
    width: "100%",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    border: "1px solid #E2E8F0",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
    color: "#6B46C1"
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: "max(calc(50% - 400px), 20px)", // Aligns with wrapper
    marginBottom: "20px",
    background: "transparent",
    border: "none",
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  /* HEADER */
  header: {
    background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
    padding: "40px 20px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid #E2E8F0",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: "15px",
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  avatarPlaceholder: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#818CF8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
    border: "4px solid white",
  },
  editBtn: {
    position: "absolute",
    bottom: "5px",
    right: "0px",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "2px solid white",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    fontSize: "16px",
    transition: "background 0.3s ease",
  },
  name: {
    margin: "0",
    fontSize: "26px",
    fontWeight: "800",
    color: "#1E1B4B",
  },
  handle: {
    margin: "4px 0 20px",
    fontSize: "15px",
    color: "#64748B",
    fontWeight: "500",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.7)",
    padding: "10px 25px",
    borderRadius: "30px",
    gap: "20px",
    backdropFilter: "blur(5px)",
  },
  statItem: { textAlign: "center" },
  statNumber: { display: "block", fontWeight: "800", fontSize: "18px", color: "#4F46E5" },
  statLabel: { fontSize: "12px", color: "#64748B", fontWeight: "600", textTransform: "uppercase" },
  statDivider: { width: "1px", height: "25px", background: "#CBD5E1" },

  /* EDIT FORM */
  formContainer: { padding: "40px 30px" },
  sectionTitle: { textAlign: "center", color: "#334155", marginBottom: "25px", marginTop: "0" },
  form: { maxWidth: "400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#475569" },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    fontSize: "15px",
    outline: "none",
    background: "#F8FAFC",
  },
  actionRow: { marginTop: "10px", display: "flex", justifyContent: "center" },
  message: { padding: "12px", borderRadius: "8px", fontSize: "14px", textAlign: "center", fontWeight: "500" },

  /* TABS & GRID */
  tabs: {
    display: "flex",
    justifyContent: "center",
    borderBottom: "1px solid #E2E8F0",
    background: "#fff",
  },
  tab: {
    flex: 1,
    padding: "15px",
    background: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    color: "#64748B",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.2s",
  },
  activeTab: {
    flex: 1,
    padding: "15px",
    background: "transparent",
    border: "none",
    borderBottom: "3px solid #6B46C1",
    color: "#6B46C1",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },
  gridContainer: {
    padding: "30px",
    background: "#FAFAFA",
    minHeight: "300px",
  },
  /* Override styles to make BlogCard grid fit inside settings */
  gridOverride: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Responsive grid
    gap: "20px",
  },
  emptyState: {
    textAlign: "center",
    color: "#94A3B8",
    paddingTop: "40px",
    fontStyle: "italic",
    fontSize: "15px",
  }
};