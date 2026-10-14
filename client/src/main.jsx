import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { EnquiryProvider } from "./context/EnquiryContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EnquiryProvider>
          <App />
        </EnquiryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
