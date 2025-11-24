// src/utility/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  // Logged in, allow access..
  return children;
}
