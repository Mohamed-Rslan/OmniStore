import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  Paper,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  LockOutlined
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Calculate prices
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const couponDiscount = couponApplied ? discount * totalPrice / 100 : 0;
  const orderTotal = totalPrice + shipping - couponDiscount;
  
  // Handle quantity increment
  const handleIncrement = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      updateQuantity(productId, cartItem.quantity + 1);
    }
  };
  
  // Handle quantity decrement
  const handleDecrement = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(productId, cartItem.quantity - 1);
    }
  };
    // Handle quantity direct change
  const handleQuantityChange = (productId, event) => {
    const value = event.target.value;
    
    // Allow empty input for better typing experience
    if (value === '') {
      // Just update the UI without validation for a better typing experience
      updateQuantity(productId, value);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        updateQuantity(productId, numValue);
      }
    }
  };
  
  // Handle remove item
  const handleRemoveItem = (productId) => {
    setDeleteItemId(productId);
    setDeleteDialogOpen(true);
  };
  
  // Confirm delete
  const confirmDelete = () => {
    removeFromCart(deleteItemId);
    setDeleteDialogOpen(false);
  };
  
  // Apply coupon
  const handleApplyCoupon = () => {
    // Simulating coupon validation - in a real app, this would be a server request
    setLoading(true);
    setCouponError(null);
    
    setTimeout(() => {
      const coupons = {
        'WELCOME10': 10,
        'SUMMER20': 20,
        'SALE15': 15
      };
      
      if (couponCode in coupons) {
        setCouponApplied(true);
        setDiscount(coupons[couponCode]);
      } else {
        setCouponError('Invalid coupon code');
      }
      setLoading(false);
    }, 1000);
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (totalItems === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Looks like you haven't added any products to your cart yet.
        </Typography>
        <Button 
          component={Link} 
          to="/products"
          variant="contained" 
          size="large" 
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </Typography>
              <Button 
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setDeleteItemId(null); // null means clear all
                }}
              >
                Clear Cart
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {/* Cart Item List */}
            {cart.map(item => (
              <Box key={item.id} sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box 
                      component={Link}
                      to={`/products/${item.id}`}
                      sx={{
                        display: 'block',
                        width: '100%',
                        paddingTop: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={9} sm={10}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography 
                          variant="subtitle1" 
                          component={Link}
                          to={`/products/${item.id}`}
                          sx={{ 
                            color: 'text.primary',
                            textDecoration: 'none',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        {/* Display selected size and color if available */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                          {item.selectedSize && (
                            <Typography variant="body2" color="text.secondary">
                              Size: {item.selectedSize}
                            </Typography>
                          )}
                          {item.selectedColor && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Color: {item.selectedColor}
                              </Typography>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%',
                                bgcolor: item.selectedColor.toLowerCase(),
                                border: item.selectedColor.toLowerCase() === 'white' ? '1px solid #ddd' : 'none',
                              }} />
                            </Box>
                          )}
                        </Box>
                        
                        {item.discount > 0 && (
                          <Typography variant="body2" color="error">
                            {item.discount}% OFF
                          </Typography>
                        )}
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDecrement(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e)}
                            inputProps={{
                              min: 1,
                              style: { textAlign: 'center', width: '40px' }
                            }}
                            sx={{ mx: 1 }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleIncrement(item.id)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-end', sm: 'flex-end' } }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                        </Typography>
                        
                        {item.discount > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        )}
                        
                        <Button
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                
                {cart.indexOf(item) < cart.length - 1 && (
                  <Divider sx={{ my: 3 }} />
                )}
              </Box>
            ))}
            
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/products"
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Subtotal:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body1">Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </Typography>
                  </Grid>
                  
                  {couponApplied && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body1">Discount ({discount}%):</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" color="error.main">
                          -${couponDiscount.toFixed(2)}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={1} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary.main">
                    ${orderTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              
              {/* Coupon Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Apply Coupon Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    fullWidth
                    disabled={couponApplied || loading}
                  />
                  <Button 
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || couponApplied || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Apply'}
                  </Button>
                </Box>
                
                {couponError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {couponError}
                  </Alert>
                )}
                
                {couponApplied && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {discount}% discount applied!
                  </Alert>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Try these codes: WELCOME10, SUMMER20, SALE15
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
                startIcon={<LockOutlined />}
              >
                Proceed to Checkout
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                <LocalShipping fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Free shipping on orders over $50
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          {deleteItemId === null ? 'Clear Cart' : 'Remove Item'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {deleteItemId === null 
              ? 'Are you sure you want to remove all items from your cart?' 
              : 'Are you sure you want to remove this item from your cart?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            onClick={deleteItemId === null ? clearCart : confirmDelete}
            autoFocus
          >
            {deleteItemId === null ? 'Clear All' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
