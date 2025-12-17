import { useState } from "react";
import { forgotPassword } from "../src/api/auth";
import { useNavigate } from "react-router-dom";
import ThreeDButton from "../components/ThreeDButton"; // Assuming you have this from previous code

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await forgotPassword({ email });
      setStatus("success");
      setMessage(res.data.message || "Reset link sent! Check your inbox.");
      setEmail(""); // Clear input on success
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header Icon & Title */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            {/* Simple SVG Lock Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 style={styles.title}>Forgot Password?</h1>
          <p style={styles.subtitle}>
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Feedback Message Area */}
          {message && (
            <div style={{
              ...styles.messageBox,
              backgroundColor: status === "success" ? "#F0FDF4" : "#FEF2F2",
              color: status === "success" ? "#166534" : "#991B1B",
              border: status === "success" ? "1px solid #BBF7D0" : "1px solid #FECACA"
            }}>
              {status === "success" ? "✓ " : "⚠ "} {message}
            </div>
          )}

          {/* Submit Action */}
          <div style={styles.buttonWrapper}>
            <ThreeDButton
              text={status === "loading" ? "Sending..." : "Send Reset Link"}
              disabled={status === "loading" || status === "success"}
              type="submit"
            />
          </div>
        </form>

        {/* Navigation "Escape Hatch" */}
        <div style={styles.footer}>
          <span 
            onClick={() => navigate("/login")} 
            style={styles.backLink}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back to Login
          </span>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    padding: "20px",
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    textAlign: "center",
  },
  iconCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#F3E8FF", // Light purple background for icon
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#1E1B4B", // Dark navy
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748B", // Slate gray
    lineHeight: "1.5",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginLeft: "4px",
  },
  input: {
    height: "48px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    outline: "none",
    fontSize: "15px",
    background: "#F8FAFC",
    color: "#1E293B",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  buttonWrapper: {
    marginTop: "10px",
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  messageBox: {
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "center",
    animation: "fadeIn 0.3s ease-in",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    borderTop: "1px solid #F1F5F9",
    paddingTop: "20px",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#6B46C1",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
    userSelect: "none",
  }
};