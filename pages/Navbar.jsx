// import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    width: "250px",
    height: "100vh",
    padding: "1.5rem 1rem",
    background: "#f5f5f5",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    zIndex: 10,
  };

  const logoutButtonStyle = {
    marginTop: "auto", // pushes button to bottom
    padding: "0.75rem",
    borderRadius: "0.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const navLinkStyle = {
    textDecoration: "none",
    color: "#059669",
    fontWeight: "500",
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333" }}>
          Welcome, {user?.name || user?.email}
        </h3>
      </div>

      <nav style={{ flexGrow: 1 }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <a href="#" style={navLinkStyle}>Dashboard</a>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <a href="#" style={navLinkStyle}>Settings</a>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <a href="#" style={navLinkStyle}>Profile</a>
          </li>
        </ul>
      </nav>

      <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
    </div>
  );
}
