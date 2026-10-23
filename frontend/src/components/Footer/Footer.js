import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              OmniStore
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your premier fashion destination for designer clothing and accessories. Elevate your style with our curated collection.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook">
                <Facebook />
              </IconButton>
              <IconButton aria-label="twitter">
                <Twitter />
              </IconButton>
              <IconButton aria-label="instagram">
                <Instagram />
              </IconButton>
              <IconButton aria-label="linkedin">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              Products
            </Link>
            <Link href="/cart" color="inherit" display="block" sx={{ mb: 1 }}>
              Cart
            </Link>
            <Link href="/login" color="inherit" display="block" sx={{ mb: 1 }}>
              Login
            </Link>
          </Grid>          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              123 El-Nahas Street
              <br />
              El-Geish District
              <br />
              Tanta, Gharbia, Egypt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contact@omnistore.dev
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +20 (40) 333-4444
            </Typography>
          </Grid>
        </Grid>        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' OmniStore. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
