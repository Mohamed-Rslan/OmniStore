import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  Drawer,
  IconButton,
  CircularProgress,
  Pagination,
  Divider,
  Chip,
  toLowerCase,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  FilterAlt,
  Sort,
  Close,
  FilterAltOff,
} from '@mui/icons-material';
import ProductCard from '../components/Product/ProductCard';
import { getAllProducts, getCategories } from '../services/productService';

// Using function declaration instead of arrow function
function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
    // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  // Debounce timer for price filter
  let priceChangeTimer = null;
  
  // Get query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const saleParam = params.get('sale');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (saleParam === 'true') setShowDiscountedOnly(true);
  }, [location.search]);
  
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        
        const allCategories = await getCategories();
        setCategories(allCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
      // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
      // Apply discount filter
    if (showDiscountedOnly) {
      result = result.filter(product => product.discount > 0);
    }
    
    // Apply in stock filter
    if (showInStockOnly) {
      result = result.filter(product => product.inStock === true);
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured'
        result.sort((a, b) => b.featured - a.featured);
    }
    
    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [products, searchQuery, selectedCategory, priceRange, showDiscountedOnly, showInStockOnly, sortBy]);
  
  // Calculate pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Handlers
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    updateUrl('search', e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    updateUrl('category', e.target.value);
  };  const handlePriceChange = (e, newValue) => {
    // Use requestAnimationFrame for smoother drag updates
    requestAnimationFrame(() => {
      setPriceRange(newValue);
    });
  };
  
  const handleDiscountChange = (e) => {
    setShowDiscountedOnly(e.target.checked);
    if (e.target.checked) {
      updateUrl('sale', 'true');
    } else {
      removeUrlParam('sale');
    }
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 2000]);
    setShowDiscountedOnly(false);
    setShowInStockOnly(false);
    setSortBy('featured');
    navigate('/products');
  };
  
  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };
  
  // Helper to update URL params
  const updateUrl = (param, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };
  
  const removeUrlParam = (param) => {
    const params = new URLSearchParams(location.search);
    params.delete(param);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };
  
  // Filters component - extracted to avoid repetition
  function FiltersComponent() {
    return (
      <Box sx={{ p: { xs: 2, md: 0 }, pr: { md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          {isMobile && (
            <IconButton onClick={toggleFilterDrawer}>
              <Close />
            </IconButton>
          )}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Category</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              displayEmpty
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            onChangeCommitted={(e, newValue) => {
              updateUrl('minPrice', newValue[0].toString());
              updateUrl('maxPrice', newValue[1].toString());
            }}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            step={50}
            />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">${priceRange[0]}</Typography>
            <Typography variant="body2">${priceRange[1]}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={showDiscountedOnly}
                onChange={handleDiscountChange}
              />
            }
            label="On Sale Only"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
              />
            }
            label="In Stock Only"
          />
        </Box>
        
        <Button 
          variant="outlined" 
          color="secondary"
          startIcon={<FilterAltOff />}
          onClick={handleClearFilters}
          fullWidth
        >
          Clear Filters
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Products
      </Typography>
      
      {/* Search and Sort Bar */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
          />
        </Grid>
        <Grid item xs={8} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} md={1} sx={{ display: { md: 'none' } }}>
          <Button 
            fullWidth
            variant="outlined"
            onClick={toggleFilterDrawer}
            startIcon={<FilterAlt />}
            sx={{ height: '100%' }}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
      
      {/* Active Filters */}
      {(searchQuery || selectedCategory || showDiscountedOnly || showInStockOnly || priceRange[0] > 0 || priceRange[1] < 2000) && (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>Active Filters:</Typography>
          
          {searchQuery && (
            <Chip 
              label={`Search: ${searchQuery}`} 
              onDelete={() => { setSearchQuery(''); removeUrlParam('search'); }}
              size="small"
            />
          )}
          
          {selectedCategory && (
            <Chip 
              label={`Category: ${selectedCategory}`} 
              onDelete={() => { setSelectedCategory(''); removeUrlParam('category'); }}
              size="small"
            />
          )}
          
          {(priceRange[0] > 0 || priceRange[1] < 2000) && (
            <Chip 
              label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
              onDelete={() => setPriceRange([0, 2000])}
              size="small"
            />
          )}
          
          {showDiscountedOnly && (
            <Chip 
              label="On Sale" 
              onDelete={() => { setShowDiscountedOnly(false); removeUrlParam('sale'); }}
              size="small"
            />
          )}
          
          {showInStockOnly && (
            <Chip 
              label="In Stock Only" 
              onDelete={() => setShowInStockOnly(false)}
              size="small"
            />
          )}
          
          <Button 
            variant="text" 
            size="small" 
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </Box>
      )}
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' } }}>
          <FiltersComponent />
        </Grid>
        
        {/* Products Grid */}
        <Grid item xs={12} md={9} lg={10}>
          {currentProducts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {currentProducts.map(product => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom>No products found</Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleClearFilters}
                sx={{ mt: 2 }}
              >
                Reset Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: 280 }}>
          <FiltersComponent />
        </Box>
      </Drawer>
    </Container>
  );
}

// Make sure to properly export the component
export default ProductsPage;
