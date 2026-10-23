import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Rating,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Visibility,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useCart } from '../../context/CartContext';

// Custom styled Badge for discount label
const DiscountBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 10,
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontWeight: 'bold',
    minWidth: '60px',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    transform: 'none',
    position: 'absolute',
    zIndex: 10,
  },
}));

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  const calculateDiscountedPrice = (price, discount) => {
    if (discount > 0) {
      return price * (1 - discount / 100);
    }
    return price;
  };
  
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const renderColorOptions = () => {
    if (!product.colors || product.colors.length === 0) return null;
    
    // Color mapping for common clothing color names
    const getColorCode = (colorName) => {
      const colorMap = {
        // Basic colors
        'black': '#000000',
        'white': '#FFFFFF',
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#008000',
        'yellow': '#FFFF00',
        'purple': '#800080',
        'orange': '#FFA500',
        'pink': '#FFC0CB',
        'brown': '#A52A2A',
        'grey': '#808080',
        'gray': '#808080',
        
        // Fashion colors
        'navy': '#000080',
        'burgundy': '#800020',
        'teal': '#008080',
        'maroon': '#800000',
        'olive': '#808000',
        'beige': '#F5F5DC',
        'cream': '#FFFDD0',
        'khaki': '#C3B091',
        'tan': '#D2B48C',
        'coral': '#FF7F50',
        'turquoise': '#40E0D0',
        'lavender': '#E6E6FA',
        'mint': '#98FF98',
        'salmon': '#FA8072',
        'peach': '#FFDAB9',
        'mustard': '#FFDB58',
        'charcoal': '#36454F',
        'indigo': '#4B0082',
        'ivory': '#FFFFF0',
        'silver': '#C0C0C0',
        'gold': '#FFD700',
        
        // Patterns (using representative colors)
        'floral': '#FFC0CB',
        'palm': '#90EE90',
        'geometric': '#ADD8E6',
        'stripe': '#4682B4',
        'plaid': '#CD5C5C',
        'polka': '#9370DB',
        'camo': '#5F9EA0',
        'animal': '#D2691E',
        'leopard': '#C19A6B',
        'zebra': '#E0E0E0',
      };
      
      const lowerColor = colorName.toLowerCase();
      
      // Check for exact matches
      if (colorMap[lowerColor]) return colorMap[lowerColor];
      
      // Check for partial matches (for patterns or combined colors)
      for (const [key, value] of Object.entries(colorMap)) {
        if (lowerColor.includes(key)) return value;
      }
      
      // Fallback for unknown colors
      return '#CCCCCC';
    };
    
    return (
      <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
        {product.colors.slice(0, 3).map((color, index) => (
          <Tooltip key={index} title={color}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: getColorCode(color),
                border: '1px solid #ddd',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        ))}
        {product.colors.length > 3 && (
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            +{product.colors.length - 3}
          </Typography>
        )}
      </Box>
    );
  };
  
  const renderSizeOptions = () => {
    if (!product.sizes || product.sizes.length === 0) return null;
    
    return (
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {product.sizes.slice(0, 4).map((size, index) => (
          <Chip
            key={index}
            label={size}
            size="small"
            variant="outlined"
            sx={{ 
              height: 20,
              fontSize: '0.6rem',
              '& .MuiChip-label': { px: 0.7, py: 0.1 }
            }}
          />
        ))}
        {product.sizes.length > 4 && (
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            +{product.sizes.length - 4}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        },
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardActionArea 
        component={Link} 
        to={`/products/${product.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >        <Box sx={{ position: 'relative' }}>
          {product.discount > 0 ? (
            <DiscountBadge
              badgeContent={`${product.discount}% OFF`}
              sx={{ width: '100%' }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{ 
                  height: 250,
                  objectFit: 'cover',
                }}
              />
            </DiscountBadge>
          ) : (
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{ 
                height: 250,
                objectFit: 'cover',
              }}
            />          )}
          
          <Box 
            sx={{ 
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            {!product.inStock && (
              <Chip
                label="Out of Stock"
                color="error"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            )}
            
            <Chip
              label={product.category}
              color="primary"
              size="small"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
            />
          </Box>
          
          <Box 
            sx={{ 
              position: 'absolute',
              top: 10,
              right: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)',
                width: 30,
                height: 30,
              }}
              onClick={toggleFavorite}
            >
              {isFavorite ? 
                <Favorite fontSize="small" color="error" /> : 
                <FavoriteBorder fontSize="small" />
              }
            </IconButton>
            
            <IconButton 
              component={Link}
              to={`/products/${product.id}`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)',
                width: 30,
                height: 30,
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Typography 
            variant="subtitle1" 
            component="h2"
            noWrap
            sx={{ fontWeight: 'medium', mb: 0.5 }}
          >
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.reviewCount})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="h6" 
              component="span"
              color={product.discount > 0 ? 'primary' : 'text.primary'}
              sx={{ fontWeight: 'bold' }}
            >
              ${discountedPrice.toFixed(2)}
            </Typography>
            
            {product.discount > 0 && (
              <Typography 
                variant="body2" 
                component="span" 
                sx={{ ml: 1, textDecoration: 'line-through' }}
                color="text.secondary"
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {renderColorOptions()}
              {renderSizeOptions()}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {product.gender}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained"
          fullWidth
          size="medium"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          sx={{ borderRadius: 2 }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
