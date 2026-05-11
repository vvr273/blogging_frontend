import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../src/api/auth";
import { toDisplayError } from "../src/api/client";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setMessage(res.message || "Email verified successfully");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setMessage(toDisplayError(err));
      }
    };
    verify();
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
