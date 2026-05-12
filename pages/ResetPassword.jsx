import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordWithOtp, resendResetOtp } from "../src/api/auth";
import { toDisplayError } from "../src/api/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      const res = await resetPasswordWithOtp({ email, otp, password });
      setMessage(res.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setMessage(toDisplayError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    try {
      setBusy(true);
      const res = await resendResetOtp({ email });
      setMessage(res.message || "Reset OTP resent");
    } catch (err) {
      setMessage(toDisplayError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lilac px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-russian-violet text-center">Reset Password (OTP)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button type="submit" className="w-full bg-russian-violet text-white py-2 rounded-md" disabled={busy}>
            {busy ? "Submitting..." : "Reset Password"}
          </button>
        </form>

        <button type="button" onClick={handleResend} className="w-full border border-russian-violet text-russian-violet py-2 rounded-md" disabled={busy}>
          Resend OTP
        </button>

        {message && <p className="text-center text-sm text-pink-lavender">{message}</p>}
      </div>
    </div>
  );
}
