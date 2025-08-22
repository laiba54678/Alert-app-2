import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
  token: null,
  user: null,
  isAdmin: false,
  setToken: () => {},
  logout: () => {},
  authenticateWithToken: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = jwtDecode(token);
        setUser(decoded || null);
      } catch {
        setUser(null);
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const logout = () => setToken(null);

  const authenticateWithToken = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded || null);
    } catch {
      setUser(null);
    }
    setToken(newToken);
  };

  const isAdmin = useMemo(() => {
    // Expecting role flag in token, e.g. { roles: ['admin'] } or { is_admin: true }
    if (!user) return false;
    if (user.is_admin) return true;
    if (Array.isArray(user.roles)) return user.roles.includes('admin');
    return false;
  }, [user]);

  const value = useMemo(() => ({ token, user, isAdmin, setToken, logout, authenticateWithToken }), [token, user, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


