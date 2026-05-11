import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../src/api/auth";
import "./Dashboard.css";
const API_URL = import.meta.env.VITE_API_URL_blog;


export default function Dashboard() {
  // State
  const [activeTab, setActiveTab] = useState("home");
  const [allBlogs, setAllBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  
  // User State for Profile Header
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // -------------------- Effects --------------------
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Load User Data from Local Storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [all, my, trending] = await Promise.all([
          axios.get(`${API_URL}/all`, { params: { page, limit } }),
          token
            ? axios.get(`${API_URL}/my`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
              })
            : Promise.resolve({ data: { items: [], totalPages: 1 } }),
          axios.get(`${API_URL}/trending`),
        ]);
        const allData = Array.isArray(all.data) ? { items: all.data, totalPages: 1 } : all.data;
        const myData = Array.isArray(my.data) ? { items: my.data, totalPages: 1 } : my.data;
        setAllBlogs(allData.items || []);
        setMyBlogs(myData.items || []);
        setTrendingBlogs(trending.data);
        if (activeTab === "home") setTotalPages(allData.totalPages || 1);
        if (activeTab === "my") setTotalPages(myData.totalPages || 1);
        if (activeTab === "trending") setTotalPages(1);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    loadData();
  }, [token, page, limit, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // -------------------- Handlers --------------------
  const handleDelete = async (id) => {
    if (!token) return alert("Please login");
    if (!window.confirm("Delete this blog?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filterFunc = (b) => b._id !== id;
      setAllBlogs((p) => p.filter(filterFunc));
      setMyBlogs((p) => p.filter(filterFunc));
      setTrendingBlogs((p) => p.filter(filterFunc));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login"); 
  };

  const handleNavClick = (action, tabName = "") => {
    if (action === "navigate") {
      navigate(tabName);
    } else {
      setActiveTab(tabName);
    }
    setSidebarOpen(false); 
  };

  const getActiveList = () => {
    if (activeTab === "home") return allBlogs;
    if (activeTab === "trending") return trendingBlogs;
    if (activeTab === "my") return myBlogs;
    return allBlogs;
  };

  const filteredList = getActiveList().filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h1 className="logo-text" onClick={()=>navigate("/about") }>BlogSphere</h1>
          <button className="close-btn-mobile" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-label">MENU</p>
          <button className={`menu-item ${activeTab === "home" ? "active" : ""}`} onClick={() => handleNavClick("tab", "home")}>
            🏠 Home Feed
          </button>
          <button className={`menu-item ${activeTab === "trending" ? "active" : ""}`} onClick={() => handleNavClick("tab", "trending")}>
            🔥 Trending
          </button>
          <button className={`menu-item ${activeTab === "my" ? "active" : ""}`} onClick={() => handleNavClick("tab", "my")}>
            📂 My Blogs
          </button>

          <p className="menu-label">ACTIONS</p>
          <button className="menu-item" onClick={() => handleNavClick("navigate", "/blogs/create")}>
            ✍️ Create Blog
          </button>
          <button className="menu-item" onClick={() => handleNavClick("navigate", "/settings")}>
            ⚙️ Settings
          </button>
          <button className="menu-item" onClick={() => handleNavClick("navigate","/about")}>
            ℹ️ About 
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-item" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="top-header">
          <div className="flex-align">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <h2 className="page-title">
              {activeTab === 'home' ? 'Latest Feeds' : activeTab === 'trending' ? 'Trending Now' : 'My Collection'}
            </h2>
          </div>

          <div className="header-actions">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* --- NEW PROFILE SECTION --- */}
            {user && (
              <div 
                className="profile-pill" 
                onClick={() => navigate("/settings")}
                title="Go to Profile Settings"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="User" className="profile-img-small" />
                ) : (
                  <div className="profile-initial-small">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="profile-name-text">
                  {user.name ? user.name.split(" ")[0] : "User"}
                </span>
              </div>
            )}
            
          </div>
        </header>

        {/* Blog Grid */}
        <div className="blog-grid fade-in">
          {filteredList.length > 0 ? (
            filteredList.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
            ))
          ) : (
            <p className="empty-msg">No blogs found.</p>
          )}
          <div className="loading-trigger" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="menu-item"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || activeTab === "trending"}
            >
              Previous
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              className="menu-item"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || activeTab === "trending"}
            >
              Next
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
