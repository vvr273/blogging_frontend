import { useState, useEffect, useRef } from "react";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../src/api/auth";
import {
  deleteBlog,
  fetchBlogs,
  fetchMyBlogs,
  fetchTrendingBlogs,
} from "../src/api/blogs";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [allBlogs, setAllBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cacheRef = useRef(new Map());

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchByTab = async (tab, targetPage, shouldSetState = true) => {
      const cacheKey = `${tab}:${targetPage}:${limit}`;
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        if (shouldSetState) {
          if (tab === "home") setAllBlogs(cached.items || []);
          if (tab === "my") setMyBlogs(cached.items || []);
          if (tab === "trending") setTrendingBlogs(cached.items || []);
          setTotalPages(cached.totalPages || 1);
          setTotalItems(cached.total || 0);
        }
        return cached;
      }

      let result = { items: [], totalPages: 1, total: 0 };
      if (tab === "home") {
        result = await fetchBlogs({ page: targetPage, limit });
      } else if (tab === "my") {
        result = token
          ? await fetchMyBlogs({ page: targetPage, limit })
          : { items: [], totalPages: 1, total: 0 };
      } else {
        const items = await fetchTrendingBlogs();
        result = { items, totalPages: 1, total: items.length };
      }

      cacheRef.current.set(cacheKey, result);
      if (shouldSetState) {
        if (tab === "home") setAllBlogs(result.items || []);
        if (tab === "my") setMyBlogs(result.items || []);
        if (tab === "trending") setTrendingBlogs(result.items || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.total || 0);
      }
      return result;
    };

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const current = await fetchByTab(activeTab, page, true);
        const nextPage = page + 1;
        if (activeTab !== "trending" && nextPage <= (current.totalPages || 1)) {
          fetchByTab(activeTab, nextPage, false).catch(() => {});
        }
      } catch (err) {
        setError("Could not load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, page, limit, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!token) return alert("Please login");
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      const filterFunc = (b) => b._id !== id;
      setAllBlogs((p) => p.filter(filterFunc));
      setMyBlogs((p) => p.filter(filterFunc));
      setTrendingBlogs((p) => p.filter(filterFunc));
      setTotalItems((prev) => Math.max(0, prev - 1));
      cacheRef.current.clear();
    } catch {
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

  const isTrending = activeTab === "trending";
  const safePage = isTrending ? 1 : page;
  const safeTotalPages = isTrending ? 1 : totalPages;
  const canGoPrev = !isTrending && safePage > 1;
  const canGoNext = !isTrending && safePage < safeTotalPages;
  const pageStart = totalItems === 0 ? 0 : (safePage - 1) * limit + 1;
  const pageEnd = totalItems === 0 ? 0 : Math.min(safePage * limit, totalItems);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h1 className="logo-text" onClick={() => navigate("/about")}>BlogSphere</h1>
          <button className="close-btn-mobile" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-label">MENU</p>
          <button className={`menu-item ${activeTab === "home" ? "active" : ""}`} onClick={() => handleNavClick("tab", "home")}>🏠 Home Feed</button>
          <button className={`menu-item ${activeTab === "trending" ? "active" : ""}`} onClick={() => handleNavClick("tab", "trending")}>🔥 Trending</button>
          <button className={`menu-item ${activeTab === "my" ? "active" : ""}`} onClick={() => handleNavClick("tab", "my")}>📂 My Blogs</button>

          <p className="menu-label">ACTIONS</p>
          <button className="menu-item" onClick={() => handleNavClick("navigate", "/blogs/create")}>✍️ Create Blog</button>
          <button className="menu-item" onClick={() => handleNavClick("navigate", "/settings")}>⚙️ Settings</button>
          <button className="menu-item" onClick={() => handleNavClick("navigate", "/about")}>ℹ️ About</button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-item" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="flex-align">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <h2 className="page-title">
              {activeTab === "home" ? "Latest Feeds" : activeTab === "trending" ? "Trending Now" : "My Collection"}
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

            {user && (
              <div className="profile-pill" onClick={() => navigate("/settings")} title="Go to Profile Settings">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="User" className="profile-img-small" />
                ) : (
                  <div className="profile-initial-small">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                )}
                <span className="profile-name-text">{user.name ? user.name.split(" ")[0] : "User"}</span>
              </div>
            )}
          </div>
        </header>

        <div className="pagination-shell pagination-top">
          <div className="pagination-meta">
            {isTrending
              ? `Trending list (${filteredList.length} items)`
              : `Showing ${pageStart}-${pageEnd} of ${totalItems} blogs`}
          </div>
          <div className="pagination-actions">
            <button className="pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canGoPrev}>Previous</button>
            <span className="pagination-page">Page {safePage} / {safeTotalPages}</span>
            <button className="pagination-btn" onClick={() => setPage((p) => Math.min(safeTotalPages, p + 1))} disabled={!canGoNext}>Next</button>
          </div>
        </div>

        <div className="blog-grid fade-in">
          {loading && (
            <>
              <div className="blog-skeleton" />
              <div className="blog-skeleton" />
              <div className="blog-skeleton" />
            </>
          )}
          {!loading && error && <p className="empty-msg">{error}</p>}
          {!loading && !error && filteredList.length > 0 ? (
            filteredList.map((blog) => <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />)
          ) : null}
          {!loading && !error && filteredList.length === 0 && <p className="empty-msg">No blogs found.</p>}
        </div>

        <div className="pagination-shell pagination-bottom">
          <div className="pagination-actions">
            <button className="pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canGoPrev}>Previous</button>
            <span className="pagination-page">Page {safePage} / {safeTotalPages}</span>
            <button className="pagination-btn" onClick={() => setPage((p) => Math.min(safeTotalPages, p + 1))} disabled={!canGoNext}>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
