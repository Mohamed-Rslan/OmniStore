import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Badge, Menu, MenuItem, InputBase, Box, Drawer,
  List, ListItem, ListItemText, ListItemIcon, Divider,
  useMediaQuery, useTheme
} from '@mui/material';
import { 
  ShoppingCart, Search, AccountCircle, 
  Menu as MenuIcon, Close, Favorite, Home,
  Category, ExitToApp
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuId = 'primary-search-account-menu';
  
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>My Profile</MenuItem>
      <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>My Orders</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
            <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ 
              fontWeight: 700, 
              letterSpacing: '.2rem',
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            OmniStore
          </Typography>

          {!isMobile && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/products">Products</Button>
            </>
          )}

          <SearchWrapper sx={{ flexGrow: 1, mx: 2, display: { xs: 'none', sm: 'flex' } }}>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </SearchWrapper>

          <Box sx={{ flexGrow: { md: 1 } }} />
          
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <IconButton
                edge="end"
                aria-label="account"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileMenu}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={toggleMobileMenu}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/products">
              <ListItemIcon><Category /></ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button component={Link} to="/cart">
              <ListItemIcon>
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCart />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem button component={Link} to="/wishlist">
              <ListItemIcon><Favorite /></ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemIcon><AccountCircle /></ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItem>
                <ListItem button component={Link} to="/orders">
                  <ListItemIcon><Category /></ListItemIcon>
                  <ListItemText primary="My Orders" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon><ExitToApp /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem button component={Link} to="/login">
                <ListItemIcon><AccountCircle /></ListItemIcon>
                <ListItemText primary="Login / Register" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
