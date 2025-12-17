import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../src/api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lilac px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-russian-violet text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-ultra-violet"
            required
          />
          <button type="submit" className="w-full bg-russian-violet text-white py-2 rounded-md hover:bg-ultra-violet transition">
            Reset Password
          </button>
        </form>
        {message && <p className="text-center text-sm text-pink-lavender">{message}</p>}
      </div>
    </div>
  );
}
