// src/components/GoogleSignIn.jsx
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import axios from "axios";

const AUTH_API_URL = import.meta.env.VITE_API_UR_auth;

function GoogleSignIn() {
  const handleSuccess = async (res) => {
    const { credential } = res; // Get credential
    const decoded = jwtDecode(credential);
    console.log("Google user:", decoded);

    await axios.post(`${AUTH_API_URL}/google-login`, {
      credential,
    });
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
}

export default GoogleSignIn;
