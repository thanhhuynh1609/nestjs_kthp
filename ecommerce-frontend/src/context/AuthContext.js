// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (user) {
        // Đảm bảo user object luôn có trường admin
        const userWithAdmin = {
          ...user,
          admin: user.admin || false
        };
        localStorage.setItem('user', JSON.stringify(userWithAdmin));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (userData, jwtToken) => {
  // Đảm bảo cấu trúc user object hoàn chỉnh
  const completeUser = {
    _id: userData._id,
    username: userData.username,
    seller: userData.seller || false,
    admin: userData.admin || false,
    created: userData.created || new Date().toISOString()
  };
  
  console.log('USER BEFORE SETSTATE:', completeUser); // Debug
  
  setUser(completeUser);
  setToken(jwtToken);
  
  // Thêm kiểm tra ngay sau khi login
  setTimeout(() => {
    console.log('CURRENT USER AFTER LOGIN:', user);
  }, 1000);
};


  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};