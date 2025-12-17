import { useState } from "react";
import { loginUser, registerUser, googleLoginUser } from "../src/api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import ThreeDButton from "../components/ThreeDButton";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // UX State
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const switchForm = (login) => {
    setMessage("");
    setMessageType("error"); // Reset to default
    setIsLogin(login);
    // We only clear email if switching manually, not after success
    if (messageType !== "success") {
        setEmail("");
    }
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!isLogin && password !== confirmPassword) return "Passwords do not match";
    if (!isLogin && !name) return "Name is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessageType("error");
      setMessage(error);
      return;
    }
    
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const res = await loginUser({ email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        // --- SIGNUP FLOW ---
        await registerUser({ name, email, password });
        
        // 1. Show Success Message
        setMessageType("success");
        setMessage("Signup successful! ✉️ Please check your email to verify your account before logging in.");
        
        // 2. Automatically switch to Login view so they can login after verifying
        setIsLogin(true);
        
        // 3. Clear sensitive fields but keep email for convenience
        setPassword("");
        setConfirmPassword("");
        setName("");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (res) => {
    setIsLoading(true);
    try {
      const { data } = await googleLoginUser(res.credential);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Title with fade effect */}
        <div style={styles.titleText}>
          <div
            style={{
              ...styles.title,
              opacity: isLogin ? 1 : 0,
              transform: isLogin ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: isLogin ? "auto" : "none",
            }}
          >
            Welcome Back
          </div>

          <div
            style={{
              ...styles.title,
              opacity: isLogin ? 0 : 1,
              transform: isLogin ? "translateY(-20px)" : "translateY(0)",
              pointerEvents: isLogin ? "none" : "auto",
            }}
          >
            Join Us Today!
          </div>
        </div>

        {/* Slide controls */}
        <div style={styles.slideControls}>
          <label
            style={{
              ...styles.slide,
              color: isLogin ? "#fff" : "#6B46C1",
              fontWeight: isLogin ? "bold" : "normal",
            }}
            onClick={() => switchForm(true)}
          >
            Login
          </label>
          <label
            style={{
              ...styles.slide,
              color: !isLogin ? "#fff" : "#6B46C1",
              fontWeight: !isLogin ? "bold" : "normal",
            }}
            onClick={() => switchForm(false)}
          >
            Signup
          </label>
          <div
            style={{
              ...styles.sliderTab,
              left: isLogin ? "0%" : "50%",
            }}
          />
        </div>

        {/* Forms container with sliding */}
        <div style={styles.formContainer}>
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              ...styles.form,
              left: isLogin ? 0 : "-100%",
              opacity: isLogin ? 1 : 0,
            }}
          >
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={styles.passLink}>
              <a href="/forgot-password" style={styles.link}>
                Forgot Password?
              </a>
            </div>

            {/* Primary Action Wrapper */}
            <div style={styles.buttonWrapper}>
              <ThreeDButton
                text={isLoading ? "Logging in..." : "Login"}
                disabled={isLoading}
                type="submit" 
              />
            </div>
          </form>

          {/* Signup Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              ...styles.form,
              left: isLogin ? "100%" : 0,
              opacity: isLogin ? 0 : 1,
            }}
          >
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

             {/* Primary Action Wrapper */}
             <div style={styles.buttonWrapper}>
                <ThreeDButton
                text={isLoading ? "Signing up..." : "Signup"}
                disabled={isLoading}
                type="submit"
                />
            </div>
          </form>
        </div>

        {/* Dynamic Message Box (Error vs Success) */}
        {message && (
            <div style={{
                ...styles.messageBox,
                backgroundColor: messageType === "success" ? "#F0FDF4" : "#FEF2F2",
                color: messageType === "success" ? "#166534" : "#EF4444",
                border: messageType === "success" ? "1px solid #BBF7D0" : "1px solid #FECACA",
            }}>
                {message}
            </div>
        )}

        {/* Footer Section: Google Login & About Us */}
        <div style={styles.footer}>
            <div style={styles.divider}>
                <span>OR</span>
            </div>
            
            <div style={styles.googleContainer}>
                <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => {
                    setMessageType("error");
                    setMessage("Google login failed");
                }}
                disabled={isLoading}
                />
            </div>

            <div style={styles.secondaryAction}>
                 <p style={styles.secondaryText}>Want to know more?</p>
                 <div onClick={() => navigate("/about")} style={styles.aboutBtnWrapper}>
                    <ThreeDButton
                        text={"About Us"}
                        disabled={isLoading}
                    />
                 </div>
            </div>
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
  wrapper: {
    maxWidth: "420px",
    width: "100%",
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    position: "relative",
    border: "1px solid rgba(255,255,255,0.8)",
    overflow: "hidden", 
  },
  titleText: {
    textAlign: "center",
    marginBottom: "30px",
    position: "relative",
    height: "40px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#1E1B4B",
    letterSpacing: "-0.02em",
    position: "absolute",
    width: "100%",
    left: 0,
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  slideControls: {
    position: "relative",
    display: "flex",
    height: "50px",
    width: "100%",
    margin: "0 0 30px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#F1F5F9",
    padding: "4px",
  },
  slide: {
    flex: 1,
    textAlign: "center",
    lineHeight: "42px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    zIndex: 1,
    transition: "color 0.3s ease",
  },
  sliderTab: {
    position: "absolute",
    height: "calc(100% - 8px)",
    top: "4px",
    width: "calc(50% - 8px)",
    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    borderRadius: "10px",
    transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 0,
    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.3)",
  },
  formContainer: {
    position: "relative",
    height: "360px", 
    overflow: "visible", 
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    position: "absolute",
    top: 0,
    transition: "left 0.6s ease-in-out, opacity 0.3s ease",
  },
  input: {
    height: "50px",
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    outline: "none",
    fontSize: "15px",
    background: "#F8FAFC",
    color: "#1E293B",
    transition: "all 0.2s ease",
  },
  passLink: {
    textAlign: "right",
    marginTop: "-5px",
  },
  link: {
    color: "#4F46E5",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: "10px",
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  /* Updated Message Box Style */
  messageBox: {
    marginTop: "16px",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: 500,
    padding: "12px",
    borderRadius: "8px",
    lineHeight: "1.4",
  },
  footer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    color: "#94A3B8",
    fontSize: "12px",
    fontWeight: 600,
    margin: "10px 0",
    ":before": { content: '""', flex: 1, borderBottom: "1px solid #E2E8F0", marginRight: "10px" },
    ":after": { content: '""', flex: 1, borderBottom: "1px solid #E2E8F0", marginLeft: "10px" }
  },
  googleContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  secondaryAction: {
    borderTop: "1px solid #F1F5F9",
    paddingTop: "20px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  secondaryText: {
    color: "#64748B",
    fontSize: "13px",
    margin: 0
  },
  aboutBtnWrapper: {
    transform: "scale(0.9)",
  }
};