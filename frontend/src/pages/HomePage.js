import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Typography, Grid, Box, Button,
  CircularProgress, Paper, MobileStepper
} from '@mui/material';
import { 
  ShoppingBag, LocalShipping, 
  Security, SupportAgent, KeyboardArrowLeft, KeyboardArrowRight
} from '@mui/icons-material';
// import ProductCard from '../components/Product/ProductCard'; // Temporarily commented out
// import { 
//   getAllProducts, 
//   getFeaturedProducts
// } from '../services/productService'; // Temporarily commented out

// Hero section slides for the carousel
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    title: "Summer Collection 2025",
    description: "Explore our exclusive designer pieces with up to 30% off",
    buttonText: "Shop Collection",
    link: "/products?sale=true"
  },  {
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    title: "Luxury Accessories",
    description: "Complete your look with our curated selection of premium accessories",
    buttonText: "Discover Now",
    link: "/products?category=Accessories"
  },
  {
    image: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    title: "Designer Showcase",
    description: "Trendy outfits crafted for the modern fashion enthusiast",
    buttonText: "View Collection",
    link: "/products?category=Clothing"
  }
];

// Using regular function declaration for the main component
function HomePage() {
  // Removed unused state variables to fix ESLint warnings
  const [loading, setLoading] = useState(false); // Changed initial value to false since we're not fetching
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = heroSlides.length;
  
  // Handle carousel navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevActiveStep) => 
        prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
      );
    }, 6000);
    
    return () => {
      clearInterval(timer);
    };
  }, [maxSteps]);
  
  // useEffect(() => { // Temporarily commented out data fetching
  //   const fetchData = async () => {
  //     try {
  //       const featured = await getFeaturedProducts();
  //       setFeaturedProducts(featured);
        
  //       const products = await getAllProducts();
  //       const shuffled = [...products].sort(() => 0.5 - Math.random());
  //       setNewArrivals(shuffled.slice(0, 4));
        
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchData();
  // }, []);

  // Manually set loading to false for now as fetch is disabled
  useEffect(() => {
    setLoading(false);
  }, []);

  // Hero section carousel item - also using regular function declaration
  function CarouselItem({ item }) {
    return (
      <Box
        sx={{
          height: { xs: '50vh', md: '70vh' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ color: 'white', maxWidth: { xs: '100%', md: '50%' } }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>
              Limited Time Offer
            </Typography>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              {item.title}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {item.description}
            </Typography>
            <Button 
              component={Link} 
              to={item.link} 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              {item.buttonText}
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }
  // Features section
  const features = [
    { 
      icon: <ShoppingBag fontSize="large" />, 
      title: "Designer Collection", 
      description: "Curated fashion pieces from top designers worldwide." 
    },
    { 
      icon: <LocalShipping fontSize="large" />, 
      title: "Premium Delivery", 
      description: "Free express shipping on orders over $100." 
    },
    { 
      icon: <Security fontSize="large" />, 
      title: "Secure Shopping", 
      description: "Shop with confidence using our secure payment platform." 
    },
    { 
      icon: <SupportAgent fontSize="large" />, 
      title: "Personal Stylist", 
      description: "Connect with our style experts for personalized fashion advice." 
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Hero Carousel with custom implementation using MobileStepper */}
      <Box sx={{ mb: 6, position: 'relative' }}>
        <Box sx={{ position: 'relative' }}>
          <CarouselItem item={heroSlides[activeStep]} />
        </Box>
        
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ 
            backgroundColor: 'transparent', 
            position: 'absolute', 
            bottom: 0, 
            width: '100%',
            justifyContent: 'center'
          }}
          nextButton={
            <Button 
              size="small" 
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              sx={{ 
                position: 'absolute', 
                right: 16, 
                bgcolor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button 
              size="small" 
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ 
                position: 'absolute', 
                left: 16, 
                bgcolor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              <KeyboardArrowLeft />
            </Button>
          }
        />
      </Box>

      <Container maxWidth="lg">
        {/* Features Section */}
        <Box sx={{ my: 8 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: 2,
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
          {/* Featured Products - Temporarily commented out product mapping */}
        <Box sx={{ my: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
              Designer Highlights
            </Typography>
            <Button component={Link} to="/products" variant="outlined">
              Browse Collection
            </Button>
          </Box>
          
          {/* <Grid container spacing={3}>
            {featuredProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid> */}
          <Typography variant="body1">Featured products temporarily hidden for debugging.</Typography>
        </Box>
        
        {/* Banner */}
        <Box sx={{ my: 8 }}>
          <Paper 
            sx={{ 
              backgroundImage: 'linear-gradient(to right, #000428, #004e92)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 4, md: 6 }, color: 'white' }}>                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Exclusive Collection
                  </Typography>
                  <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                    Designer Showcase
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Spring/Summer 2025
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ opacity: 0.8, mb: 4 }}>
                    Join OmniStore Rewards for 15% off your first designer purchase and exclusive early access to new collections.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link}
                    to="/products"
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100'
                      } 
                    }}
                  >
                    Shop Now
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{
                    height: { xs: '200px', md: '100%' },
                    backgroundImage: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
        
        {/* New Arrivals - Temporarily commented out product mapping */}
        <Box sx={{ my: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
              New Arrivals
            </Typography>
            <Button component={Link} to="/products" variant="outlined">
              View All
            </Button>
          </Box>
          
          {/* <Grid container spacing={3}>
            {newArrivals.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid> */}
          <Typography variant="body1">New arrivals temporarily hidden for debugging.</Typography>
        </Box>
        
        {/* Newsletter */}
        <Box 
          sx={{ 
            my: 8,
            py: 6,
            px: { xs: 3, md: 6 },
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', color: 'text.secondary' }}>
            Stay updated with our latest products, exclusive offers, and fashion inspiration.
          </Typography>
          
          <Box 
            component="form" 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              maxWidth: '500px',
              mx: 'auto'
            }}
            onSubmit={(e) => {
              e.preventDefault();
              // Newsletter subscription logic would go here
              alert('Thank you for subscribing!');
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              style={{ 
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                py: { xs: 1.5, sm: 'auto' },
                px: { xs: 2, sm: 4 }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

// Make sure to properly export the component
export default HomePage;
