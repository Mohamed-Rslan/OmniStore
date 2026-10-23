import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Payment,
  CheckCircleOutline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const steps = ['Shipping', 'Payment', 'Review'];

// Array of countries with Arab countries prominently included
const countries = [
  // Arab countries
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'EG', name: 'Egypt' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SY', name: 'Syria' },
  { code: 'YE', name: 'Yemen' },
  // Other countries
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
].sort((a, b) => a.name.localeCompare(b.name));

// Component defined outside of main component to prevent recreation on each render
const CheckoutTextField = React.forwardRef(function CheckoutTextField(props, ref) {
  // Prevent the component from being recreated by using a stable onChange handler
  const { onChange, ...otherProps } = props;
  const handleChange = React.useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return (
    <TextField
      {...otherProps}
      onChange={handleChange}
      inputRef={ref}
      inputProps={{
        ...otherProps.inputProps,
        autoComplete: 'new-password', // This trick often helps with focus issues
      }}
    />
  );
});

// Shipping form - Moved outside of main component to prevent recreation
const ShippingForm = React.memo(({ shippingInfo, handleShippingChange, handleNext }) => (
  <Box component="form">
    <Typography variant="h6" gutterBottom>
      Shipping Address
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="First Name"
          name="firstName"
          value={shippingInfo.firstName}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="Last Name"
          name="lastName"
          value={shippingInfo.lastName}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <CheckoutTextField
          required
          fullWidth
          label="Address"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <CheckoutTextField
          fullWidth
          label="Apartment, suite, etc. (optional)"
          name="apartment"
          value={shippingInfo.apartment}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="City"
          name="city"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="State/Province/Region"
          name="state"
          value={shippingInfo.state}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="Zip / Postal code"
          name="zipCode"
          value={shippingInfo.zipCode}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country"
            name="country"
            value={shippingInfo.country}
            onChange={handleShippingChange}
            label="Country"
            required
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={shippingInfo.phone}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CheckoutTextField
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={shippingInfo.saveInfo}
              onChange={handleShippingChange}
              name="saveInfo"
              color="primary"
            />
          }
          label="Save this information for next time"
        />
      </Grid>
    </Grid>
    
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
      >
        Continue to Payment
      </Button>
    </Box>
  </Box>
));

// PaymentForm - Moved outside main component to prevent recreation
const PaymentForm = React.memo(({ paymentInfo, handlePaymentChange, handleRadioChange, handleBack, handleNext }) => (
  <Box component="form">
    <Typography variant="h6" gutterBottom>
      Payment Method
    </Typography>
    
    <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
      <RadioGroup
        name="paymentMethod"
        value={paymentInfo.paymentMethod}
        onChange={handleRadioChange}
      >
        <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 1 }}>
          <FormControlLabel
            value="credit"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ mr: 1 }} />
                <Typography>Credit / Debit Card</Typography>
              </Box>
            }
          />
          
          {paymentInfo.paymentMethod === 'credit' && (
            <Box sx={{ pl: 4, pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CheckoutTextField
                    required
                    fullWidth
                    label="Name on card"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CheckoutTextField
                    required
                    fullWidth
                    label="Card number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    autoComplete="off"
                    inputProps={{ 
                      maxLength: 19,
                    }}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CheckoutTextField
                    required
                    fullWidth
                    label="Expiry date"
                    name="expDate"
                    value={paymentInfo.expDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    autoComplete="off"
                    inputProps={{ 
                      maxLength: 5
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CheckoutTextField
                    required
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    type="password"
                    autoComplete="off"
                    inputProps={{ 
                      maxLength: 3
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
        
        <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 1 }}>
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} />
                <Typography>PayPal</Typography>
              </Box>
            }
          />
        </Paper>
        
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <FormControlLabel
            value="bank"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1 }} />
                <Typography>Bank Transfer</Typography>
              </Box>
            }
          />
        </Paper>
      </RadioGroup>
    </FormControl>
    
    <FormControlLabel
      control={
        <Checkbox 
          checked={paymentInfo.sameAsShipping}
          onChange={handlePaymentChange}
          name="sameAsShipping"
          color="primary"
        />
      }
      label="Billing address is the same as shipping address"
    />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button onClick={handleBack}>
        Back to Shipping
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
      >
        Review Order
      </Button>
    </Box>
  </Box>
));

// Review form
const ReviewForm = React.memo(({ cart, shippingInfo, paymentInfo, handleBack, handlePlaceOrder, loading }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Order Summary
    </Typography>
    
    <List sx={{ mb: 3 }}>
      {cart.map((item) => (
        <ListItem key={item.id} sx={{ px: 0, py: 1 }}>
          <ListItemAvatar>
            <Avatar src={item.image} alt={item.title} variant="square" sx={{ width: 56, height: 56, borderRadius: 1 }} />
          </ListItemAvatar>
          <ListItemText 
            primary={item.title} 
            secondary={`Quantity: ${item.quantity}`}
            sx={{ ml: 1 }}
          />
          <Typography variant="body2">
            ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
          </Typography>
        </ListItem>
      ))}
    </List>
    
    <Divider sx={{ my: 2 }} />
    
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Shipping
        </Typography>
        <Typography gutterBottom>{`${shippingInfo.firstName} ${shippingInfo.lastName}`}</Typography>
        <Typography gutterBottom>{shippingInfo.address}</Typography>
        {shippingInfo.apartment && (
          <Typography gutterBottom>{shippingInfo.apartment}</Typography>
        )}
        <Typography gutterBottom>{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`}</Typography>
        <Typography gutterBottom>{shippingInfo.country}</Typography>
        <Typography>{shippingInfo.phone}</Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        {paymentInfo.paymentMethod === 'credit' && (
          <>
            <Typography gutterBottom>Card: **** **** **** {paymentInfo.cardNumber.slice(-4)}</Typography>
            <Typography gutterBottom>Name: {paymentInfo.cardName}</Typography>
            <Typography>Expires: {paymentInfo.expDate}</Typography>
          </>
        )}
        {paymentInfo.paymentMethod === 'paypal' && (
          <Typography>PayPal</Typography>
        )}
        {paymentInfo.paymentMethod === 'bank' && (
          <Typography>Bank Transfer</Typography>
        )}
      </Grid>
    </Grid>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button onClick={handleBack}>
        Back to Payment
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Place Order'}
      </Button>
    </Box>
  </Box>
));

// Order confirmation component
const OrderConfirmation = React.memo(({ orderId, shippingInfo, navigate }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
    
    <Typography variant="h4" gutterBottom>
      Thank You For Your Order!
    </Typography>
    
    <Typography variant="body1" paragraph>
      Your order has been placed successfully.
    </Typography>
    
    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Order Number: {orderId}
    </Typography>
    
    <Typography variant="body2" paragraph color="text.secondary">
      We've sent a confirmation email to {shippingInfo.email}.
    </Typography>
    
    <Box sx={{ mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </Button>
    </Box>
  </Box>
));

// Main checkout component
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    email: user?.email || '',
    saveInfo: true
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'credit',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    sameAsShipping: true
  });
  
  // Input change handlers for form fields that maintain focus - with empty dependency array to prevent recreation
  const handleShippingChange = React.useCallback((e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setShippingInfo(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Directly set error to empty rather than checking error state
    setError('');
  }, []);
  
  const handlePaymentChange = React.useCallback((e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setPaymentInfo(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Directly set error to empty rather than checking error state
    setError('');
  }, []);
  
  // Special handler for radio buttons
  const handleRadioChange = React.useCallback((e) => {
    const { name, value } = e.target;
    
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Directly set error to empty rather than checking error state
    setError('');
  }, []);
  
  // Handle next step
  const handleNext = React.useCallback(() => {
    // Validate current step
    if (activeStep === 0) {
      // Validate shipping info
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || 
          !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode || 
          !shippingInfo.country || !shippingInfo.phone || !shippingInfo.email) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      // Validate payment info
      if (paymentInfo.paymentMethod === 'credit') {
        if (!paymentInfo.cardName || !paymentInfo.cardNumber || 
            !paymentInfo.expDate || !paymentInfo.cvv) {
          setError('Please fill in all payment details');
          return;
        }
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  }, [activeStep, shippingInfo, paymentInfo]);
  
  // Handle back step
  const handleBack = React.useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  }, []);
  
  // Handle order submission
  const handlePlaceOrder = React.useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random order ID
      const newOrderId = 'ORD-' + Math.floor(100000000 + Math.random() * 900000000);
      setOrderId(newOrderId);
      
      // Clear the cart
      clearCart();
      
      // Set order complete
      setOrderComplete(true);
    } catch (err) {
      setError('There was a problem processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [clearCart]);
  
  // Calculate prices
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.07;
  const orderTotal = totalPrice + shipping + tax;

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ShippingForm 
            shippingInfo={shippingInfo} 
            handleShippingChange={handleShippingChange}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <PaymentForm 
            paymentInfo={paymentInfo}
            handlePaymentChange={handlePaymentChange}
            handleRadioChange={handleRadioChange}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <ReviewForm 
            cart={cart}
            shippingInfo={shippingInfo}
            paymentInfo={paymentInfo}
            handleBack={handleBack}
            handlePlaceOrder={handlePlaceOrder}
            loading={loading}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Checkout
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
            {orderComplete ? (
              <OrderConfirmation 
                orderId={orderId} 
                shippingInfo={shippingInfo}
                navigate={navigate}
              />
            ) : (
              <>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                {getStepContent(activeStep)}
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ position: 'sticky', top: 20, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List disablePadding>
                {cart.map((item) => (
                  <ListItem sx={{ py: 1, px: 0 }} key={item.id}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.title} <Typography component="span" variant="body2" color="text.secondary">x{item.quantity}</Typography>
                    </Typography>
                    <Typography variant="body2">
                      ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body2">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body2">
                    ${tax.toFixed(2)}
                  </Typography>
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ${orderTotal.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
