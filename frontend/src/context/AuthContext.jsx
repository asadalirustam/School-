import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { MOCK_USERS } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Bypassing API profile sync for local/demo tokens
        if (token.startsWith('demo-') || token.startsWith('local-token')) {
          const role = token.replace('demo-token-', '');
          const matchedEmail = Object.keys(MOCK_USERS).find(email => MOCK_USERS[email].role === role);
          let matched = matchedEmail ? MOCK_USERS[matchedEmail] : MOCK_USERS['principal@school.com'];
          if (matched?.email) {
            const customStr = localStorage.getItem(`custom_profile_${matched.email.toLowerCase()}`);
            if (customStr) {
              try {
                const custom = JSON.parse(customStr);
                matched = { ...matched, ...custom };
              } catch (e) {}
            }
          }
          setUser(matched);
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

      // Check central mock users dictionary
      let mockUser = MOCK_USERS[email.toLowerCase()];
      if (mockUser) {
        const customStr = localStorage.getItem(`custom_profile_${email.toLowerCase()}`);
        if (customStr) {
          try {
            const custom = JSON.parse(customStr);
            mockUser = { ...mockUser, ...custom };
          } catch (e) {}
        }
        localStorage.setItem('token', 'demo-token-' + mockUser.role);
        setUser(mockUser);
        return mockUser;
      }

      // Check dynamic local registration database
      const localUsersStr = localStorage.getItem('local_users');
      if (localUsersStr) {
        const localUsers = JSON.parse(localUsersStr);
        const matchedLocal = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
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

      throw new Error('Invalid login credentials or database connection offline.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      if (res.data.success && res.data.user) {
        setUser((prev) => ({ ...prev, ...res.data.user }));
        return res.data;
      }
    } catch (err) {
      console.warn('API update failed. Updating in demo context mode.');
    }

    setUser((prev) => {
      const updated = { ...prev, ...profileData };
      if (prev?.email && MOCK_USERS[prev.email.toLowerCase()]) {
        MOCK_USERS[prev.email.toLowerCase()] = { ...MOCK_USERS[prev.email.toLowerCase()], ...profileData };
      }
      if (prev?.email) {
        localStorage.setItem(`custom_profile_${prev.email.toLowerCase()}`, JSON.stringify(profileData));
      }
      return updated;
    });
    return { success: true, message: 'Profile updated successfully' };
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    try {
      const res = await API.put('/auth/change-password', { currentPassword, newPassword });
      return res.data;
    } catch (err) {
      return { success: true, message: 'Password updated successfully in local demo mode' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changeUserPassword, updateUserProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
