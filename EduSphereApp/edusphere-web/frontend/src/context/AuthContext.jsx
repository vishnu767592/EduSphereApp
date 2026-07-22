import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('edusphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session from token/localStorage
    const savedToken = localStorage.getItem('edusphere_token');
    const savedUser = localStorage.getItem('edusphere_user');
    
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        const fallback = { id: 1, name: 'Sharath User', email: 'lekkalavishnu7675@gmail.com', role: 'USER' };
        setUser(fallback);
        localStorage.setItem('edusphere_user', JSON.stringify(fallback));
      }
    } else if (savedToken) {
      const fallback = { id: 1, name: 'Sharath User', email: 'lekkalavishnu7675@gmail.com', role: 'USER' };
      setUser(fallback);
      localStorage.setItem('edusphere_user', JSON.stringify(fallback));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userRole = (email && email.toLowerCase().includes('admin')) ? 'ADMIN' : 'USER';
    const userName = email ? (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)) : 'Learner';
    
    const loggedUser = {
      id: Date.now(),
      name: userName === 'Admin' ? 'EduSphere Admin' : userName,
      email: email || 'user@edusphere.com',
      role: userRole
    };
    const mockToken = `edusphere_jwt_token_${Date.now()}`;

    localStorage.setItem('edusphere_token', mockToken);
    localStorage.setItem('edusphere_user', JSON.stringify(loggedUser));
    
    setToken(mockToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name, email, password) => {
    const newUser = {
      id: Date.now(),
      name: name || 'Learner',
      email: email || 'user@edusphere.com',
      role: 'USER'
    };
    const mockToken = `edusphere_jwt_token_${Date.now()}`;

    localStorage.setItem('edusphere_token', mockToken);
    localStorage.setItem('edusphere_user', JSON.stringify(newUser));

    setToken(mockToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('edusphere_token');
    localStorage.removeItem('edusphere_user');
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
