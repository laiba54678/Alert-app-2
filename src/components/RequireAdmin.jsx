import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const { token: ctxToken, isAdmin: ctxIsAdmin } = useAuth();

  let token = ctxToken;
  let isAdmin = ctxIsAdmin;

  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        isAdmin = Boolean(user?.is_admin || (Array.isArray(user?.roles) && user.roles.includes('admin')));
      } catch {
        isAdmin = false;
      }
    }
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


