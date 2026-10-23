import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Tab,
  Tabs,
  Card,
  CardContent
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  CreditCard,
  Edit,
  Security
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Simple TabPanel component for profile sections
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Mock order history data
  const orderHistory = [
    {
      id: 'ORD-548721',
      date: '2025-04-10',
      status: 'Delivered',
      items: 3,
      total: 149.97
    },
    {
      id: 'ORD-548620',
      date: '2025-03-22',
      status: 'Delivered',
      items: 2,
      total: 89.98
    },
    {
      id: 'ORD-547892',
      date: '2025-02-15',
      status: 'Delivered',
      items: 1,
      total: 59.99
    }
  ];
    // Mock wishlist items
  const wishlistItems = [
    {
      id: 1,
      name: 'Premium Silk Blouse',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1564257592-5dcd6ac5b663?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    },
    {
      id: 2,
      name: 'Designer Sunglasses',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1577803645773-f96470509666'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>
      
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100,
                  fontSize: 40,
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </Avatar>
              <Typography variant="h6">{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem 
                button 
                selected={tabValue === 0}
                onClick={() => setTabValue(0)}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Personal Information" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 1}
                onClick={() => setTabValue(1)}
              >
                <ListItemIcon>
                  <ShoppingBag />
                </ListItemIcon>
                <ListItemText primary="Order History" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 2}
                onClick={() => setTabValue(2)}
              >
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 3}
                onClick={() => setTabValue(3)}
              >
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Addresses" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 4}
                onClick={() => setTabValue(4)}
              >
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText primary="Payment Methods" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 5}
                onClick={() => setTabValue(5)}
              >
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth
              onClick={logout}
            >
              Log Out
            </Button>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: { xs: 'block', md: 'none' } }}>
              <Tabs 
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Profile" />
                <Tab label="Orders" />
                <Tab label="Wishlist" />
                <Tab label="Addresses" />
                <Tab label="Payment" />
                <Tab label="Security" />
              </Tabs>
            </Box>
            
            {/* Personal Information */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button startIcon={<Edit />} size="small">
                  Edit
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    defaultValue="John"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    defaultValue="Doe"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    defaultValue={user?.email || 'user@example.com'}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="(555) 123-4567"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Order History */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>
              
              {orderHistory.map((order) => (
                <Card key={order.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Order #{order.id}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          bgcolor: 'success.light', 
                          color: 'success.dark', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontSize: '0.75rem' 
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Placed on {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        Total: ${order.total.toFixed(2)}
                      </Typography>
                      <Button 
                        component={Link} 
                        to={`/orders/${order.id}`}
                        size="small" 
                        variant="outlined"
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </TabPanel>
            
            {/* Wishlist */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Wishlist
              </Typography>
              
              {wishlistItems.length > 0 ? (
                <Grid container spacing={2}>
                  {wishlistItems.map((item) => (
                    <Grid item xs={12} sm={6} key={item.id}>
                      <Card>
                        <CardContent sx={{ display: 'flex', gap: 2 }}>
                          <Box 
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0
                            }}
                          >
                            <img 
                              src={item.image}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">
                              {item.name}
                            </Typography>
                            <Typography variant="body1" color="primary.main" sx={{ mb: 1 }}>
                              ${item.price.toFixed(2)}
                            </Typography>
                            <Button 
                              variant="outlined" 
                              size="small"
                              component={Link}
                              to={`/products/${item.id}`}
                            >
                              View Product
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Your wishlist is empty.
                </Typography>
              )}
            </TabPanel>
            
            {/* Addresses */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Saved Addresses</Typography>
                <Button variant="outlined" size="small">
                  Add New Address
                </Button>
              </Box>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Home
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.dark', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.75rem' 
                      }}
                    >
                      Default
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                    John Doe<br />
                    123 Main Street<br />
                    Apt 4B<br />
                    New York, NY 10001<br />
                    United States<br />
                    (555) 123-4567
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>
            
            {/* Payment Methods */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Payment Methods</Typography>
                <Button variant="outlined" size="small">
                  Add New Card
                </Button>
              </Box>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Visa ending in 4242
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'primary.dark', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.75rem' 
                      }}
                    >
                      Default
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Expires 12/2025
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>
            
            {/* Security */}
            <TabPanel value={tabValue} index={5}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Change Password
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained">Update Password</Button>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
