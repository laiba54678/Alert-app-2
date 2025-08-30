import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function getValidToken() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("token");

  // If nothing in storage or junk string, treat as unauthenticated
  if (!raw || raw === "null" || raw === "undefined") return null;

  // If it's a JWT, check expiry
  try {
    const parts = raw.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token");
        return null;
      }
    }
  } catch {
    // Not a JWT — allow as opaque token
  }

  return raw;
}

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(getValidToken());
    setLoading(false);
  }, []);

  if (loading) return null; // or spinner

  if (!token) {
    // redirect to login if no valid token
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
