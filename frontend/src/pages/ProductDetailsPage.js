import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  Rating,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  IconButton,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Cached,
  Security,
  Add,
  Remove
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getProductById, getAllProducts } from '../services/productService';
import { useCart } from '../context/CartContext';

// Custom styled components
const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Available sizes based on product category
  const getSizesForCategory = (category) => {
    if (!category) return [];
    
    const sizesByCategory = {
      'Clothing': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Shoes': ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
      'Accessories': ['One Size'],
      'default': ['S', 'M', 'L']
    };
    
    return sizesByCategory[category] || sizesByCategory.default;
  };
  
  // Available colors with their hex codes
  const availableColors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Navy', code: '#000080' },
    { name: 'Gray', code: '#808080' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Purple', code: '#800080' },
    { name: 'Brown', code: '#A52A2A' },
    { name: 'Orange', code: '#FFA500' }
  ];
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          // Product not found, redirect to products page
          navigate('/products');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
        navigate('/products');
      }
    };
    
    fetchProduct();
  }, [id, navigate]);
  
  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    // Validate selections for clothing items
    if (product.category === 'Clothing' && !selectedSize) {
      setSnackbarMessage('Please select a size');
      setSnackbarOpen(true);
      return;
    }
    
    if ((product.category === 'Clothing' || product.category === 'Shoes') && !selectedColor) {
      setSnackbarMessage('Please select a color');
      setSnackbarOpen(true);
      return;
    }
    
    // Include selected size and color with the product when adding to cart
    const productWithOptions = {
      ...product,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null
    };
    
    addToCart(productWithOptions, quantity);
    setSnackbarMessage(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`);
    setSnackbarOpen(true);
  };
  
  // Handle favorite toggle
  const toggleFavorite = () => {
    setFavorite(!favorite);
    setSnackbarMessage(favorite 
      ? 'Removed from wishlist' 
      : 'Added to wishlist');
    setSnackbarOpen(true);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    // Toggle selection - if already selected, unselect it
    if (selectedSize === size) {
      setSelectedSize('');
    } else {
      setSelectedSize(size);
    }
  };
  
  // Handle color selection
  const handleColorChange = (color) => {
    // Toggle selection - if already selected, unselect it
    if (selectedColor === color) {
      setSelectedColor('');
    } else {
      setSelectedColor(color);
    }
  };  // State for all products to use in recommendations
  const [allProducts, setAllProducts] = useState([]);
  
  // Fetch all products for recommendations
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productData = await getAllProducts();
        setAllProducts(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    
    fetchAllProducts();
  }, []);

  // Sample recommended outfits data using real products from our catalog
  const getRecommendedOutfits = (product) => {
    if (!product || !allProducts || allProducts.length === 0) return [];
    
    // Define category-compatible pairs for creating outfits
    const compatibleCategories = {
      'Tops': ['Pants', 'Skirts', 'Accessories', 'Shoes'],
      'Pants': ['Tops', 'Outerwear', 'Shoes', 'Accessories'],
      'Dresses': ['Shoes', 'Accessories', 'Outerwear'],
      'Outerwear': ['Tops', 'Pants', 'Dresses', 'Shoes'],
      'Shoes': ['Pants', 'Dresses', 'Tops'],
      'Accessories': ['Tops', 'Dresses', 'Outerwear', 'Pants'],
      'Knitwear': ['Pants', 'Skirts', 'Accessories', 'Shoes']
    };
    
    // Get compatible categories for this product
    const currentCategory = product.category;
    const compatibleForThisProduct = compatibleCategories[currentCategory] || Object.keys(compatibleCategories);
    
    // Filter products by compatible categories and exclude current product
    const compatibleProducts = allProducts.filter(p => 
      compatibleForThisProduct.includes(p.category) && p.id !== product.id
    );
    
    // Create outfit sets (2 outfits per product)
    const outfitSets = [];
    
    // Style 1: Casual outfit
    const casualItems = compatibleProducts
      .filter(p => p.category !== currentCategory)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    if (casualItems.length >= 2) {
      outfitSets.push({
        id: 'outfit-casual',
        name: 'Casual Style',
        items: casualItems
      });
    }
    
    // Style 2: Elegant outfit
    const elegantItems = compatibleProducts
      .filter(p => p.category !== currentCategory)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    if (elegantItems.length >= 2) {
      outfitSets.push({
        id: 'outfit-elegant',
        name: 'Elegant Look',
        items: elegantItems
      });
    }
    
    // If we couldn't create outfits based on categories, just pick random products
    if (outfitSets.length === 0) {
      const randomProducts = allProducts
        .filter(p => p.id !== product.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
        
      const set1 = randomProducts.slice(0, 3);
      const set2 = randomProducts.slice(3, 6);
      
      if (set1.length > 0) {
        outfitSets.push({
          id: 'outfit-trendy',
          name: 'Trendy Combination',
          items: set1
        });
      }
      
      if (set2.length > 0) {
        outfitSets.push({
          id: 'outfit-stylish',
          name: 'Stylish Ensemble',
          items: set2
        });
      }
    }
    
    return outfitSets;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4">Product not found</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  // Calculate the discounted price
  const discountedPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : product.price.toFixed(2);

  const recommendedOutfits = getRecommendedOutfits(product);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Link color="inherit" href="/products" underline="hover">
          Products
        </Link>
        <Link color="inherit" href={`/products?category=${product.category}`} underline="hover">
          {product.category}
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <ProductImage 
              src={product.image} 
              alt={product.title} 
              sx={{ width: '100%', maxHeight: '500px' }}
            />
            {product.discount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  bgcolor: 'error.main',
                  color: 'white',
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  fontWeight: 'bold',
                }}
              >
                {product.discount}% OFF
              </Box>
            )}
          </Box>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {product.discount > 0 ? (
              <>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${discountedPrice}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ ml: 2, textDecoration: 'line-through' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="h4" color="primary" fontWeight="bold">
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography color={product.inStock ? 'success.main' : 'error.main'} variant="subtitle1" fontWeight="bold">
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />          {/* Size Selection - Enhanced Creative UI */}
          {(['Clothing', 'Shoes', 'Tops', 'Pants', 'Knitwear', 'Shorts', 'Dresses', 'Outerwear'].includes(product.category)) && product.sizes && product.sizes.length > 0 && (
            <Box sx={{ mb: 4, position: 'relative' }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                fontWeight="500" 
                sx={{ 
                  display: 'inline-block',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '60%',
                    height: 2,
                    background: 'linear-gradient(to right, #1976d2, transparent)'
                  }
                }}
              >
                Select Size
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1.5,
                  mt: 3,
                  position: 'relative',
                  perspective: '800px'
                }}
              >
                {getSizesForCategory(product.category).map((size, index) => (
                  <Box                    key={size}
                    onClick={() => handleSizeChange(size)}
                    sx={{
                      position: 'relative',
                      width: product.category === 'Shoes' ? 50 : 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transform: selectedSize === size ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
                      zIndex: selectedSize === size ? 2 : 1,
                      animation: selectedSize === size ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.5)' },
                        '70%': { boxShadow: '0 0 0 6px rgba(25, 118, 210, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
                      },
                      // Show all sizes since we're already filtering to only display product's category sizes
                      opacity: 1,
                      pointerEvents: 'auto',
                      '&:hover': {
                        transform: 'scale(1.05) translateY(-3px)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: selectedSize === size ? '16px' : '12px',
                        border: '2px solid',
                        borderColor: selectedSize === size ? 'primary.main' : 'grey.300',
                        background: selectedSize === size 
                          ? 'linear-gradient(145deg, #e6f0ff, #ffffff)'
                          : 'white',
                        boxShadow: selectedSize === size 
                          ? '0 10px 20px rgba(25, 118, 210, 0.2), inset 0 -3px 0 rgba(25, 118, 210, 0.3)'
                          : '0 3px 6px rgba(0,0,0,0.05), inset 0 -1px 0 rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        '&::before': selectedSize === size ? {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                          opacity: 0.6,
                          animation: 'ripple 1.5s cubic-bezier(0.19, 1, 0.22, 1) infinite',
                          '@keyframes ripple': {
                            '0%': { transform: 'scale(0.8) rotate(0deg)' },
                            '100%': { transform: 'scale(1.2) rotate(45deg)' }
                          }
                        } : {}
                      }}
                    />
                    
                    <Typography 
                      sx={{ 
                        position: 'relative', 
                        fontWeight: selectedSize === size ? 'bold' : 'medium',
                        color: selectedSize === size ? 'primary.main' : 'text.primary',
                        fontSize: product.category === 'Shoes' ? '0.9rem' : '1rem',
                        textShadow: selectedSize === size ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {size}
                    </Typography>
                    
                    {product.sizes && !product.sizes.includes(size) && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '2px',
                          background: 'rgba(0,0,0,0.2)',
                          top: '50%',
                          transform: 'translateY(-50%) rotate(-45deg)'
                        }}
                      />
                    )}
                    
                    {selectedSize === size && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main'
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              
              <Box 
                sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  height: 24
                }}
              >
                {!selectedSize && (product.category === 'Clothing' || product.category === 'Shoes') ? (
                  <Typography 
                    variant="caption" 
                    color="error" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      animation: 'fadeIn 0.5s',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(-5px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                    Please select a size
                  </Typography>
                ) : selectedSize ? (
                  <Typography 
                    variant="caption" 
                    color="primary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      animation: 'slideIn 0.5s',
                      '@keyframes slideIn': {
                        from: { opacity: 0, transform: 'translateX(-10px)' },
                        to: { opacity: 1, transform: 'translateX(0)' }
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Size {selectedSize} selected
                  </Typography>
                ) : null}
              </Box>
              
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ 
                    textTransform: 'none', 
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main'
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  Size Guide
                </Button>

                <Typography variant="caption" color="text.secondary">
                  {product.sizes ? `${product.sizes.length} sizes available` : ''}
                </Typography>
              </Box>
            </Box>          )}
            {/* Color Selection - Enhanced Creative UI */}
          {product.colors && product.colors.length > 0 && (
            <Box sx={{ mb: 4, position: 'relative' }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                fontWeight="500"
                sx={{ 
                  display: 'inline-block',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '60%',
                    height: 2,
                    background: 'linear-gradient(to right, #1976d2, transparent)'
                  }
                }}
              >
                Select Color
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 3,
                  position: 'relative'
                }}
              >
                {/* Filter colors based on product.colors if available */}
                {(product.colors ? 
                  availableColors.filter(c => product.colors.includes(c.name)) : 
                  availableColors.slice(0, 8)
                ).map((color, index) => (
                  <Box
                    key={color.name}
                    onClick={() => handleColorChange(color.name)}
                    sx={{
                      position: 'relative',
                      width: 70,
                      height: 85,
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transform: selectedColor === color.name ? 'scale(1.08)' : 'scale(1)',
                      zIndex: selectedColor === color.name ? 2 : 1,
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        borderRadius: selectedColor === color.name ? '30%' : '50%',
                        transition: 'all 0.3s ease',
                        overflow: 'visible',
                        transformStyle: 'preserve-3d',
                        transform: selectedColor === color.name ? 'translateZ(10px)' : 'none',
                      }}
                    >
                      {/* Color swatch outer ring */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          right: -4,
                          bottom: -4,
                          borderRadius: selectedColor === color.name ? '30%' : '50%',
                          border: selectedColor === color.name ? '2px solid' : '1px solid',
                          borderColor: selectedColor === color.name ? 'primary.main' : 'transparent',
                          transition: 'all 0.3s ease',
                          animation: selectedColor === color.name ? 'pulse 2s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                            '70%': { boxShadow: '0 0 0 8px rgba(25, 118, 210, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
                          }
                        }}
                      />
                      
                      {/* Color swatch main circle */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: selectedColor === color.name ? '26%' : '50%',
                          transition: 'all 0.3s ease',
                          bgcolor: color.code,
                          boxShadow: selectedColor === color.name
                            ? '0 10px 20px rgba(0,0,0,0.15), inset 0 -3px 0 rgba(0,0,0,0.15), 0 0 0 4px rgba(255,255,255,0.8)'
                            : '0 4px 8px rgba(0,0,0,0.1), inset 0 -2px 0 rgba(0,0,0,0.1)',
                          border: color.name === 'White' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '5%',
                            left: '5%',
                            right: '30%',
                            bottom: '30%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                            borderRadius: '50%'
                          },
                        }}
                      />
                      
                      {/* Selected checkmark */}
                      {selectedColor === color.name && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 
                              color.name === 'White' || 
                              color.name === 'Yellow' ? 
                              'rgba(0,0,0,0.7)' : 'white',
                            animation: 'pop 0.3s ease-out',
                            '@keyframes pop': {
                              '0%': { transform: 'translate(-50%, -50%) scale(0)' },
                              '70%': { transform: 'translate(-50%, -50%) scale(1.2)' },
                              '100%': { transform: 'translate(-50%, -50%) scale(1)' }
                            }
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Color name label */}
                    <Box
                      sx={{
                        position: 'relative',
                        mt: 1,
                        textAlign: 'center',
                        transformStyle: 'preserve-3d',
                        perspective: '100px'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: selectedColor === color.name ? 'bold' : 'normal',
                          color: selectedColor === color.name ? 'primary.main' : 'text.primary',
                          transform: selectedColor === color.name ? 'translateZ(5px)' : 'none',
                          textShadow: selectedColor === color.name ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '&::after': selectedColor === color.name ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -3,
                            left: 0,
                            width: '100%',
                            height: 2,
                            background: 'currentColor',
                            opacity: 0.5,
                            borderRadius: 1
                          } : {}
                        }}
                      >
                        {color.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Box 
                sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  height: 24
                }}
              >
                {!selectedColor && (product.category === 'Clothing' || product.category === 'Shoes') ? (
                  <Typography 
                    variant="caption" 
                    color="error" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      animation: 'fadeIn 0.5s',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(-5px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    Please select a color
                  </Typography>
                ) : selectedColor ? (
                  <Typography 
                    variant="caption" 
                    color="primary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      animation: 'slideIn 0.5s',
                      '@keyframes slideIn': {
                        from: { opacity: 0, transform: 'translateX(-10px)' },
                        to: { opacity: 1, transform: 'translateX(0)' }
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    {selectedColor} selected
                  </Typography>
                ) : null}
              </Box>
              
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="caption" color="text.secondary">
                  {product.colors ? `${product.colors.length} colors available` : ''}
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <IconButton onClick={decrementQuantity} disabled={quantity <= 1}>
                <Remove />
              </IconButton>
              <TextField
                value={quantity}
                onChange={handleQuantityChange}
                variant="outlined"
                size="small"
                inputProps={{
                  style: { textAlign: 'center', width: '40px' },
                  min: 1
                }}
              />
              <IconButton onClick={incrementQuantity}>
                <Add />
              </IconButton>
            </Box>
          </Box>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <IconButton 
              color={favorite ? 'secondary' : 'default'}
              onClick={toggleFavorite}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              {favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton 
              onClick={handleShare}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Share />
            </IconButton>
          </Box>
          
          {/* Features */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1
              }}>
                <LocalShipping color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">Free Shipping</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1
              }}>
                <Cached color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">30 Days Return</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1
              }}>
                <Security color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2">Secure Payment</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Product Tabs */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Description" id="product-tab-0" />
            <Tab label="Reviews" id="product-tab-1" />
            <Tab label="Shipping" id="product-tab-2" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="body1" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, nec aliquet nisl nisl vel nisl. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquet nisl, nec aliquet nisl nisl vel nisl.
          </Typography>
          <Typography variant="body1">
            Features:
          </Typography>
          <ul>
            <li>High-quality materials</li>
            <li>Durable construction</li>
            <li>Stylish design</li>
            <li>Versatile use</li>
            <li>Easy to clean</li>
          </ul>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="large" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                {product.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewCount} reviews)
              </Typography>
            </Box>
          </Box>
          
          {/* Sample Reviews */}
          {[
            { name: 'John D.', rating: 5, date: '2 weeks ago', comment: 'Excellent product, exactly as described. Very happy with the quality.' },
            { name: 'Sarah M.', rating: 4, date: '1 month ago', comment: 'Good product for the price, arrived quickly and works well.' },
            { name: 'Robert T.', rating: 4.5, date: '2 months ago', comment: 'Very satisfied with this purchase. Would recommend to others.' }
          ].map((review, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">{review.name}</Typography>
                <Typography variant="caption" color="text.secondary">{review.date}</Typography>
              </Box>
              <Rating value={review.rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
            </Paper>
          ))}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Shipping Information</Typography>
          <Typography variant="body1" paragraph>
            We offer the following shipping options:
          </Typography>
          
          <Box component="table" sx={{ width: '100%', mb: 3, borderCollapse: 'collapse' }}>
            <Box component="thead" sx={{ borderBottom: '2px solid', borderColor: 'divider' }}>
              <Box component="tr">
                <Box component="th" sx={{ py: 1, px: 2, textAlign: 'left' }}>Shipping Method</Box>
                <Box component="th" sx={{ py: 1, px: 2, textAlign: 'left' }}>Estimated Delivery</Box>
                <Box component="th" sx={{ py: 1, px: 2, textAlign: 'left' }}>Cost</Box>
              </Box>
            </Box>
            <Box component="tbody">
              <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box component="td" sx={{ py: 2, px: 2 }}>Standard Shipping</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>5-7 Business Days</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>Free (orders over $50)</Box>
              </Box>
              <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box component="td" sx={{ py: 2, px: 2 }}>Express Shipping</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>2-3 Business Days</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>$12.99</Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 2, px: 2 }}>Next Day Delivery</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>Next Business Day</Box>
                <Box component="td" sx={{ py: 2, px: 2 }}>$24.99</Box>
              </Box>
            </Box>
          </Box>
          
          <Typography variant="body1" paragraph>
            Please note that delivery times may vary depending on your location. Orders are processed within 24 hours of being placed.
          </Typography>
        </TabPanel>
      </Box>
      
      {/* Complete the Look - Outfit Recommendations - Enhanced UI */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -8,
                height: 4,
                width: '70%',
                backgroundColor: 'primary.main',
                borderRadius: 2
              }
            }}
          >
            Complete Your Look
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph 
            sx={{ mt: 2, maxWidth: '70%' }}
          >
            Style inspiration to create perfect outfits with this item
          </Typography>
        </Box>

        {getRecommendedOutfits(product).map((outfit) => (
          <Paper 
            key={outfit.id} 
            elevation={2}
            sx={{ 
              p: 4, 
              mb: 6, 
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1976d2' }}>
                  <path d="M21.4 11.6l-9-9C12 2.2 11.5 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .5.2 1 .6 1.4l9 9c.4.4.9.6 1.4.6s1-.2 1.4-.6l7-7c.4-.4.6-.9.6-1.4 0-.5-.2-1-.6-1.4zM5.5 7C4.7 7 4 6.3 4 5.5S4.7 4 5.5 4 7 4.7 7 5.5 6.3 7 5.5 7z"/>
                </svg>
                {outfit.name} Look
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  backgroundColor: 'primary.light', 
                  color: 'white', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 10,
                  fontWeight: 'bold'
                }}
              >
                CURATED OUTFIT
              </Typography>
            </Box>
            
            <Box sx={{ position: 'relative', my: 2 }}>
              <Box 
                sx={{
                  height: '2px', 
                  backgroundColor: 'divider',
                  width: '100%',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}
              />
              
              <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
                {/* Current product */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      backgroundColor: 'background.paper',
                      p: 2,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: -30,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        px: 3,
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'top right',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 2,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      CURRENT ITEM
                    </Box>
                    
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        marginBottom: 2,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="subtitle2" noWrap>
                      {product.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
                      <Typography variant="body2" color="primary.main" fontWeight="bold">
                        ${Number(product.price).toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          backgroundColor: 'success.light', 
                          color: 'white', 
                          px: 1, 
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        IN CART
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                  {/* Outfit items */}
                {outfit.items.map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.id}>
                    <Box
                      onClick={() => navigate(`/products/${item.id}`)}
                      sx={{
                        backgroundColor: 'background.paper',
                        p: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        color: 'text.primary',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                        },
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '100%',
                          marginBottom: 2,
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            textAlign: 'center',
                            py: 0.75,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          QUICK VIEW
                        </Box>
                      </Box>
                      
                      <Typography variant="subtitle2" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                        {item.category}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>                        <Typography variant="body2" color="primary.main" fontWeight="bold">
                          ${item.price.toFixed(2)}
                        </Typography>                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation(); // Stop event from bubbling up to parent
                            addToCart(item, 1);
                            setSnackbarMessage(`${item.name} added to cart`);
                            setSnackbarOpen(true);
                          }}
                          sx={{ minWidth: 'auto', p: 0, width: 28, height: 28 }}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Outfit total and action buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', md: 'center' },
                mt: 4,
                p: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                border: '1px dashed',
                borderColor: 'primary.light'
              }}
            >
              <Box sx={{ mb: { xs: 2, md: 0 } }}>
                <Typography variant="body2" color="text.secondary">
                  OUTFIT TOTAL:
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  ${(Number(product.price) + outfit.items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
                  <Typography component="span" variant="body2" color="success.main" sx={{ ml: 1 }}>
                    Save 15%
                  </Typography>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  Save Outfit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCart />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    px: 3
                  }}
                  onClick={() => {
                    // Add all outfit items to cart
                    addToCart(product, 1);
                    outfit.items.forEach(item => {
                      addToCart({...item, id: item.id.toString()}, 1);
                    });
                    setSnackbarMessage('Complete outfit added to cart!');
                    setSnackbarOpen(true);
                  }}
                >
                  Add Complete Look
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
        {/* Recommended Outfits */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          You May Also Like
        </Typography>
        <Grid container spacing={4}>
          {recommendedOutfits.map((outfit) => (
            <Grid item xs={12} sm={6} md={4} key={outfit.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                    {outfit.name}
                  </Typography>
                  <Grid container spacing={2}>
                    {outfit.items.map((item) => (
                      <Grid item xs={4} key={item.id}>
                        <Box 
                          onClick={() => navigate(`/products/${item.id}`)}
                          sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            paddingTop: '100%', 
                            borderRadius: 1, 
                            overflow: 'hidden',
                            bgcolor: 'background.default',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailsPage;
