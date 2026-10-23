import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await axios.get(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error("Token kadaluarsa atau tidak valid:", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        setUser(null);
        navigate('/login');
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [baseUrl]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (token, userData) => {
    localStorage.setItem('access_token', token);
    if (userData) {
      setUser(userData);
    } else {
      await fetchUser();
    }
    setLoading(false);
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);