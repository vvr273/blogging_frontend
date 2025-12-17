import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLoginUser } from "../src/api/auth";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Strong validation
  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await registerUser({ name, email, password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // navigate after 2s
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  const handleGoogle = async (res) => {
    try {
      const { data } = await googleLoginUser(res.credential);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.message}>{message}</p>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Already have an account? Login
          </Link>
        </div>

        <div style={styles.googleContainer}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setMessage("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#231942", // Russian violet
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    background: "#f2eaf3", // Pink lavender
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    color: "#231942", // Russian violet
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #5e548e", // Ultra Violet
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#5e548e", // Ultra Violet
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  message: {
    color: "#e07aa0", // Pink Lavender for error
    marginTop: "0.5rem",
    fontSize: "0.9rem",
  },
  links: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#9f86c0", // African Violet
    textDecoration: "none",
  },
  googleContainer: {
    marginTop: "1.5rem",
  },
};
