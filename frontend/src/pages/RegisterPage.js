import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    acceptTerms: false
  });
  
  const steps = ['Account Information', 'Personal Details', 'Finish'];
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (error) {
      setError('');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!formData.acceptTerms) {
        throw new Error('You must accept the Terms and Conditions');
      }
      
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Attempt registration
      const success = register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        navigate('/');
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle next step
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };
  
  // Handle social registration
  const handleSocialRegistration = (provider) => {
    setLoading(true);
    
    // Simulate social registration
    setTimeout(() => {
      const user = {
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`
      };
      
      register(user);
      navigate('/');
    }, 1500);
  };
  
  // Step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Divider sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  Or register with
                </Typography>
              </Divider>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={() => handleSocialRegistration('Google')}
                  sx={{ borderRadius: 2 }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSocialRegistration('Facebook')}
                  sx={{ borderRadius: 2 }}
                >
                  Facebook
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Apple />}
                  onClick={() => handleSocialRegistration('Apple')}
                  sx={{ borderRadius: 2 }}
                >
                  Apple
                </Button>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <TextField
              margin="normal"
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              id="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              name="address"
              label="Address"
              type="text"
              id="address"
              autoComplete="street-address"
              value={formData.address}
              onChange={handleChange}
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="zipCode"
                  label="Zip / Postal Code"
                  name="zipCode"
                  autoComplete="postal-code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <TextField
              margin="normal"
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoComplete="country"
              value={formData.country}
              onChange={handleChange}
            />
          </>
        );
      case 2:
        return (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please review your information before submitting
              </Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">First Name</Typography>
                <Typography variant="body1">{formData.firstName || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Last Name</Typography>
                <Typography variant="body1">{formData.lastName || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1">{formData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body1">{formData.phone || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body1">
                  {formData.address ? (
                    <>
                      {formData.address}, {formData.city}, {formData.zipCode}, {formData.country}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </Typography>
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  name="acceptTerms"
                  color="primary"
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Create an Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join us to enjoy exclusive benefits and faster checkout
          </Typography>
        </Box>
        
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
        
        <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !formData.acceptTerms}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
        
        {activeStep === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RegisterPage;
