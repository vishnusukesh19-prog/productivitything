// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    // show nothing (or spinner) while auth initializes
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!user) {
    // redirect to /auth and preserve where user wanted to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
