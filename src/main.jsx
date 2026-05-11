import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BlogProvider } from "./context/BlogProvider.jsx";
import AppErrorBoundary from "../components/AppErrorBoundary.jsx";
import { initMonitoring } from "./monitoring.js";

initMonitoring();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <BlogProvider>
            <App />
          </BlogProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
