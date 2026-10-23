import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ 
        py: 8, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 500
          }}
        >
          <SentimentDissatisfied sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for doesn't exist or has been moved.
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              component={Link}
              to="/"
              variant="contained"
              size="large"
            >
              Back to Home
            </Button>
            
            <Button 
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
            >
              Browse Products
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
