import { Navigate } from "react-router-dom";


  export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  // Debugging: Check what is actually inside
  // console.log("Current Token in Storage:", token);

  // Robust Check: 
  // 1. Must exist
  // 2. Must not be the string "undefined"
  // 3. Must not be the string "null"
  if (!token || token === "undefined" || token === "null") {
    // If invalid, clear it to clean up the mess
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
}

