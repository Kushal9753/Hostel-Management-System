import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isAdminLogin = false) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (isAdminLogin && response.data.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      if (!isAdminLogin && response.data.role === 'admin') {
         throw new Error('Admins must use the admin login portal.');
      }

      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
        throw error.response.data.error.map(e => Object.values(e)[0]).join(', ');
      }
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
        throw error.response.data.error.map(e => Object.values(e)[0]).join(', ');
      }
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
