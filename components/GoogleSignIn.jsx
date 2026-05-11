import { GoogleLogin } from "@react-oauth/google";
import { googleLoginUser } from "../src/api/auth";

function GoogleSignIn() {
  const handleSuccess = async (res) => {
    const { credential } = res;
    await googleLoginUser(credential);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
}

export default GoogleSignIn;
