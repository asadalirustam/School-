import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Bypassing API profile sync for local/demo tokens
        if (token.startsWith('demo-') || token === 'local-token') {
          const role = token.replace('demo-token-', '');
          const demoUsers = {
            'Principal': { name: 'Principal Administrator', role: 'Principal' },
            'Examination Incharge': { name: 'Exam Incharge Office', role: 'Examination Incharge' },
            'Accountant': { name: 'Accountant Department', role: 'Accountant' }
          };
          const matched = demoUsers[role] || { name: 'Principal Administrator', role: 'Principal' };
          setUser({ id: 'demo-id-' + role, email: 'principal@school.com', status: 'Active', ...matched });
          setLoading(false);
          return;
        }

        try {
          const res = await API.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (error) {
      console.warn('API error. Trying fallback simulation bypass.', error);
      
      const demoUsers = {
        'principal@school.com': { name: 'Principal Administrator', role: 'Principal', password: 'principalpassword' },
        'exam@school.com': { name: 'Exam Incharge Office', role: 'Examination Incharge', password: 'exampassword' },
        'accountant@school.com': { name: 'Accountant Department', role: 'Accountant', password: 'accountantpassword' }
      };

      const matched = demoUsers[email];
      if (matched && matched.password === password) {
        const localUser = {
          id: 'demo-id-' + matched.role,
          name: matched.name,
          email: email,
          role: matched.role
        };
        localStorage.setItem('token', 'demo-token-' + matched.role);
        setUser(localUser);
        return localUser;
      }

      // Check dynamic local registration database
      const localUsersStr = localStorage.getItem('local_users');
      if (localUsersStr) {
        const localUsers = JSON.parse(localUsersStr);
        const matchedLocal = localUsers.find(u => u.email === email && u.password === password);
        if (matchedLocal) {
          const localUser = {
            id: 'local-id-' + matchedLocal.role + '-' + Date.now(),
            name: matchedLocal.name,
            email: email,
            role: matchedLocal.role
          };
          localStorage.setItem('token', 'demo-token-' + matchedLocal.role);
          setUser(localUser);
          return localUser;
        }
      }

      throw new Error('Database connection failed. Please ensure the backend server and MongoDB are fully active.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    const res = await API.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changeUserPassword, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
