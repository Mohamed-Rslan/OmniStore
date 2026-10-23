import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

// Create a theme instance for OmniStore
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black - elegant and timeless for fashion
      light: '#303030',
      dark: '#000000',
    },
    secondary: {
      main: '#C09F80', // Warm gold/taupe - luxury accent color
      light: '#D4B79F',
      dark: '#A67F5D',
    },
    background: {
      default: '#F8F8F8', // Soft off-white background
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
});

function App() {
  // Initialize with a default value to prevent errors on first render
  const { isAuthenticated = false } = useAuth() || {};
  // Lazy load components to avoid potential import issues
  const renderRoute = (Component, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      return <LoginPage />;
    }
      // Render the component or show error page if it fails
    try {
      return <Component />;
    } 
    // eslint-disable-next-line no-unreachable
    catch (error) {
      console.error("Error rendering component:", error);
      return <NotFoundPage errorMessage="There was an error loading this page" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={renderRoute(HomePage)} />
            <Route path="/products" element={renderRoute(ProductsPage)} />
            <Route path="/products/:id" element={renderRoute(ProductDetailsPage)} />
            <Route path="/cart" element={renderRoute(CartPage)} />
            <Route path="/login" element={renderRoute(LoginPage)} />
            <Route path="/register" element={renderRoute(RegisterPage)} />
            <Route path="/profile" element={renderRoute(ProfilePage, true)} />
            <Route path="/checkout" element={renderRoute(CheckoutPage, true)} />
            <Route path="*" element={renderRoute(NotFoundPage)} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
