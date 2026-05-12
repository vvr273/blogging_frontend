import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../src/api/auth";
import { toDisplayError } from "../src/api/client";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = useMemo(() => location.state?.email || "", [location.state]);

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const validate = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Valid email is required";
    if (!/^\d{6}$/.test(otp)) return "Enter a valid 6-digit OTP";
    return null;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      setBusy(true);
      const res = await verifyOtp({ email, otp });
      setMessage(res.message || "Email verified successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(toDisplayError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Enter a valid email before resending OTP");
      return;
    }

    try {
      setBusy(true);
      const res = await resendOtp({ email });
      setMessage(res.message || "OTP sent to your email.");
    } catch (err) {
      setMessage(toDisplayError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Verify OTP</h1>
        <p style={styles.subtitle}>Enter the 6-digit OTP sent to your email.</p>

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <input
            style={styles.input}
            placeholder="6-digit OTP"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />

          <button type="submit" style={styles.button} disabled={busy}>
            {busy ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button type="button" onClick={handleResend} style={styles.secondaryButton} disabled={busy}>
          Resend OTP
        </button>

        <p style={styles.message}>{message}</p>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
          <Link to="/register" style={styles.link}>Back to Register</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#231942",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  card: {
    background: "#f2eaf3",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  title: {
    color: "#231942",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#5e548e",
    marginBottom: "1.25rem",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #5e548e",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#5e548e",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    marginTop: "0.75rem",
    padding: "0.65rem",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #5e548e",
    background: "transparent",
    color: "#5e548e",
    fontWeight: 600,
    cursor: "pointer",
  },
  message: {
    color: "#e07aa0",
    marginTop: "0.75rem",
    minHeight: "1.2rem",
  },
  links: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#9f86c0",
    textDecoration: "none",
  },
};
