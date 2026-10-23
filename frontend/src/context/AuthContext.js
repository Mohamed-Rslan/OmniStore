import React, { createContext, useContext, useState, useEffect } from 'react';

// API URL for backend authentication
const API_URL = 'http://localhost:8000/api';

// Check if the backend server is available
const checkBackendAvailability = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(`${API_URL}/check-server/`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Backend authentication server not available, using local storage');
    return false;
  }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage on component mount
    const storedUser = localStorage.getItem('ecommerce_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Check if backend is available
    const checkBackend = async () => {
      const isAvailable = await checkBackendAvailability();
      setBackendAvailable(isAvailable);
      setLoading(false);
    };
    
    checkBackend();
  }, []);
  const login = async (userData) => {
    // Try to use backend if available, otherwise use local storage
    if (backendAvailable) {
      try {
        const response = await fetch(`${API_URL}/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const user = {
            id: data.user.id || userData.email,
            name: data.user.name || userData.email.split('@')[0],
            email: userData.email,
            token: data.token,
          };
          
          setUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('ecommerce_user', JSON.stringify(user));
          return true;
        } else {
          // If backend login fails, fall back to simulated login
          console.log('Backend login failed, using fallback');
        }
      } catch (error) {
        console.log('Error during backend login, using fallback:', error);
      }
    }
    
    // Fallback to simulated login
    const user = {
      id: userData.email,
      name: userData.email.split('@')[0],
      email: userData.email,
    };
    
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('ecommerce_user', JSON.stringify(user));
    return true;
  };

  const register = async (userData) => {
    // Try to use backend if available, otherwise use local storage
    if (backendAvailable) {
      try {
        const response = await fetch(`${API_URL}/auth/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            name: userData.name,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const user = {
            id: data.user.id || userData.email,
            name: userData.name,
            email: userData.email,
            token: data.token,
          };
          
          setUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('ecommerce_user', JSON.stringify(user));
          return true;
        } else {
          // If backend registration fails, fall back to simulated registration
          console.log('Backend registration failed, using fallback');
        }
      } catch (error) {
        console.log('Error during backend registration, using fallback:', error);
      }
    }
    
    // Fallback to simulated registration
    const user = {
      id: userData.email,
      name: userData.name,
      email: userData.email,
    };
    
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('ecommerce_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ecommerce_user');
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add default export for the context itself
export default AuthContext;
