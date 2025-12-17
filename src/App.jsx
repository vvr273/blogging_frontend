import { Routes, Route, Navigate } from "react-router-dom";

// Auth Components
import LoginSignup from "../pages/LoginSignup";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Core App Components
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import About from "../pages/About";
import Settings from "../pages/Settings"; // Import Settings

// Blog Components
import BlogListPage from "../pages/blogpages/BlogListPage";
import EditBlogPage from "../pages/blogpages/EditBlogPage";
import NewPost from "../pages/blogpages/NewPost";
import ReadBlog from "../pages/ReadBlog";

// Hooks & Utils
import useAutoLogout from "./hooks/useAutoLogout";
import { logoutUser } from "./api/auth";

export default function App() {
  // Handle auto-logout on token expiry
  useAutoLogout(() => {
    logoutUser();
    alert("You have been logged out due to inactivity.");
  });

  return (
    <Routes>
      {/* ==============================
          PUBLIC ROUTES (No Login Required)
      ============================== */}
      
      <Route path="/about" element={<About />} />
      
      {/* Auth Entry Points */}
      <Route path="/" element={<LoginSignup />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/register" element={<LoginSignup />} />
      
      {/* Account Recovery */}
      <Route path="/verify/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Public Blog List */}
      <Route path="/blogs" element={<BlogListPage />} />


      {/* ==============================
          PROTECTED ROUTES (Login Required)
      ============================== */}

      {/* 1. Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 2. Settings (MOVED HERE) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 3. Read Single Blog */}
      <Route
        path="/blog/:id"
        element={
          <ProtectedRoute>
            <ReadBlog />
          </ProtectedRoute>
        }
      />

      {/* 4. Create New Blog */}
      <Route
        path="/blogs/create"
        element={
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        }
      />

      {/* 5. Edit Blog */}
      <Route
        path="/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <EditBlogPage />
          </ProtectedRoute>
        }
      />

      {/* ==============================
          FALLBACK
      ============================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}