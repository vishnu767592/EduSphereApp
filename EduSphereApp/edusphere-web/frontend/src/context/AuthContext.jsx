import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('edusphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await parseJsonSafe(response);
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await parseJsonSafe(response);
    if (!response.ok) {
      throw new Error((data && data.message) || `Login failed (status ${response.status})`);
    }

    if (data && data.token) {
      localStorage.setItem('edusphere_token', data.token);
      setToken(data.token);
      setUser(data.user || null);
      return data.user;
    }

    throw new Error('Login succeeded but server returned no token.');
  };

  const register = async (name, email, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await parseJsonSafe(response);
    if (!response.ok) {
      throw new Error((data && data.message) || `Registration failed (status ${response.status})`);
    }

    if (data && data.token) {
      localStorage.setItem('edusphere_token', data.token);
      setToken(data.token);
      setUser(data.user || null);
      return data.user;
    }

    throw new Error('Registration succeeded but server returned no token.');
  };

  // Safe JSON parser: returns parsed object, or null if body empty or invalid JSON
  const parseJsonSafe = async (res) => {
    try {
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('edusphere_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
