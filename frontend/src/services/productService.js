// OmniStore product service - handles both API and mock data
const API_URL = 'http://localhost:8000/api';

// Backend availability state - initialized as null until checked
let backendAvailable = null;

// Check if the backend server is running
const checkBackendAvailability = async () => {
  // If we've already checked, return the cached result
  if (backendAvailable !== null) return backendAvailable;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(`${API_URL}/check-server/`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    backendAvailable = response.ok;
    return backendAvailable;
  } catch (error) {
    console.log('Backend server not available, using mock data');
    backendAvailable = false;
    return false;
  }
};

// Mock product data for fallback when server is unavailable
const mockProducts = [
  {
    id: 1,
    title: "Classic Denim Jacket",
    description: "Timeless denim jacket with a comfortable fit and vintage wash. Perfect for layering over any outfit.",
    price: 89.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    category: "Outerwear",
    rating: 4.8,
    reviewCount: 243,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue", "Light Blue", "Black"],
    material: "100% Cotton Denim",
    gender: "Unisex"
  },
  {
    id: 2,
    title: "Slim-Fit Chino Pants",
    description: "Modern slim-fit chino pants made from premium cotton. Versatile style for casual and semi-formal occasions.",
    price: 59.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1397&q=80",
    category: "Pants",
    rating: 4.5,
    reviewCount: 189,
    inStock: true,
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Khaki", "Navy", "Olive", "Black"],
    material: "98% Cotton, 2% Elastane",
    gender: "Men"
  },
  {
    id: 3,
    title: "Leather Crossbody Bag",
    description: "Handcrafted genuine leather crossbody bag with adjustable strap and multiple compartments for organization.",
    price: 129.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80",
    category: "Accessories",
    rating: 4.7,
    reviewCount: 112,
    inStock: true,
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    material: "100% Genuine Leather",
    gender: "Women"
  },
  {
    id: 4,
    title: "Cashmere Blend Sweater",
    description: "Luxuriously soft cashmere blend sweater with ribbed cuffs and hem. Perfect for staying cozy in style.",
    price: 149.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1372&q=80",
    category: "Knitwear",
    rating: 4.6,
    reviewCount: 87,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Black", "Burgundy"],
    material: "70% Wool, 30% Cashmere",
    gender: "Unisex"
  },
  {
    id: 5,
    title: "Floral Maxi Dress",
    description: "Elegant floral print maxi dress with a flattering silhouette. Perfect for summer occasions and beach vacations.",
    price: 79.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    category: "Dresses",
    rating: 4.9,
    reviewCount: 321,
    inStock: false,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue Floral", "Pink Floral"],
    material: "100% Rayon",
    gender: "Women"
  },  {
    id: 6,
    title: "Premium Silk Blouse",
    description: "Elegant silk blouse with a relaxed fit and button-up front. Effortlessly transitions from work to evening wear.",
    price: 119.99,
    discount: 0,
    image: "https://images.pexels.com/photos/6765185/pexels-photo-6765185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Tops",
    rating: 4.4,
    reviewCount: 98,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy", "Blush"],
    material: "100% Mulberry Silk",
    gender: "Women"
  },
  {
    id: 7,
    title: "Tailored Wool Blazer",
    description: "Sophisticated tailored wool blazer with a modern fit. A timeless addition to any professional wardrobe.",
    price: 199.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80",
    category: "Outerwear",
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Navy", "Black"],
    material: "80% Wool, 20% Polyester",
    gender: "Men"
  },
  {
    id: 8,
    title: "Vintage Graphic T-Shirt",
    description: "Soft, comfortable vintage-inspired graphic t-shirt made from premium cotton. Perfect for casual everyday wear.",
    price: 29.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    category: "Tops",
    rating: 4.3,
    reviewCount: 145,
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    material: "100% Organic Cotton",
    gender: "Unisex"
  },
  {
    id: 9,
    title: "High-Waisted Skinny Jeans",
    description: "Figure-flattering high-waisted skinny jeans with stretch for ultimate comfort and mobility.",
    price: 69.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    category: "Pants",
    rating: 4.6,
    reviewCount: 208,
    inStock: true,
    sizes: ["24", "25", "26", "27", "28", "29", "30", "31", "32"],
    colors: ["Dark Blue", "Black", "Light Blue", "Gray"],
    material: "92% Cotton, 6% Elastomultiester, 2% Elastane",
    gender: "Women"
  },
  {
    id: 10,
    title: "Patterned Summer Shorts",
    description: "Lightweight and breathable summer shorts with playful patterns. Perfect for beach days and casual outings.",
    price: 44.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    category: "Shorts",
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Palm Print", "Floral", "Geometric", "Solid Blue"],
    material: "100% Cotton",
    gender: "Unisex"
  },
  {
    id: 11,
    title: "Premium Leather Sneakers",
    description: "Handcrafted premium leather sneakers with cushioned insoles for all-day comfort. Versatile style for any casual outfit.",
    price: 129.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80",
    category: "Shoes",
    rating: 4.8,
    reviewCount: 123,
    inStock: true,
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["White", "Black", "Tan", "Navy"],
    material: "Full-grain Leather, Rubber Sole",
    gender: "Unisex"
  },
  {
    id: 12,
    title: "Designer Sunglasses",
    description: "Polarized designer sunglasses with 100% UV protection. Stylish frames that complement any face shape.",
    price: 159.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Accessories",
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    sizes: ["One Size"],
    colors: ["Black", "Tortoise", "Gold", "Silver"],
    material: "Acetate Frame, Polarized Lenses",
    gender: "Unisex"
  }
];

// Get all products - try API first, fall back to mock data
const getAllProducts = async () => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/products/`);
      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    }
  } catch (error) {
    console.log('Error fetching products from API, using mock data:', error);
  }
  
  // Fallback to mock data
  return mockProducts;
};

// Get product by ID - try API first, fall back to mock data
const getProductById = async (id) => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/products/${id}/`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Error fetching product from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const product = mockProducts.find(product => product.id === parseInt(id));
  return product;
};

// Get products by category - try API first, fall back to mock data
const getProductsByCategory = async (category) => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/products/?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    }
  } catch (error) {
    console.log('Error fetching products by category from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const filteredProducts = mockProducts.filter(product => product.category === category);
  return filteredProducts;
};

// Search products by query - try API first, fall back to mock data
const searchProducts = async (query) => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/products/?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    }
  } catch (error) {
    console.log('Error searching products from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const searchQuery = query.toLowerCase();
  const filteredProducts = mockProducts.filter(product => 
    product.title.toLowerCase().includes(searchQuery) || 
    product.description.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery)
  );
  return filteredProducts;
};

// Get featured products (items with discount) - try API first, fall back to mock data
const getFeaturedProducts = async () => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/featured-products/`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Error fetching featured products from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const featuredProducts = mockProducts.filter(product => product.discount > 0);
  return featuredProducts;
};

// Get categories - try API first, fall back to mock data
const getCategories = async () => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/categories/`);
      if (response.ok) {
        const data = await response.json();
        return data.results?.map(category => category.name) || [];
      }
    }
  } catch (error) {
    console.log('Error fetching categories from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const categories = [...new Set(mockProducts.map(product => product.category))];
  return categories;
};

// Create an order - try API first, fall back to client-side mock
const createOrder = async (orderData) => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Error creating order with API, using client-side mock:', error);
  }
  
  // Fallback to client-side mock
  const orderNumber = 'ORD-' + Math.floor(100000000 + Math.random() * 900000000);
  return { 
    success: true, 
    order_id: orderNumber 
  };
};

// Get user orders - try API first, fall back to mock data
const getUserOrders = async (userEmail) => {
  try {
    const isAvailable = await checkBackendAvailability();
    if (isAvailable) {
      const response = await fetch(`${API_URL}/user-orders/?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Error fetching user orders from API, using mock data:', error);
  }
  
  // Fallback to mock data
  const mockOrders = [
    {
      id: 'ORD-548721',
      order_number: 'ORD-548721',
      created_at: '2025-04-10T14:30:00Z',
      status: 'Delivered',
      total_price: 149.97,
      items: []
    },
    {
      id: 'ORD-548620',
      order_number: 'ORD-548620',
      created_at: '2025-03-22T10:15:00Z',
      status: 'Delivered',
      total_price: 89.98,
      items: []
    },
    {
      id: 'ORD-547892',
      order_number: 'ORD-547892',
      created_at: '2025-02-15T09:45:00Z',
      status: 'Delivered',
      total_price: 59.99,
      items: []
    }
  ];
  
  return mockOrders;
};

// Export the service functions
export {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  createOrder
};
