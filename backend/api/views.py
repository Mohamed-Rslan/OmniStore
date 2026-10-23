from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q

from .models import Category, Product, Order
from .serializers import (
    CategorySerializer, ProductSerializer, 
    OrderSerializer, OrderCreateSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filter products based on query parameters."""
        queryset = Product.objects.all()
        
        # Category filter
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Search filter
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Sale items filter
        sale = self.request.query_params.get('sale')
        if sale and sale.lower() == 'true':
            queryset = queryset.filter(discount__gt=0)
        
        return queryset

@api_view(['GET'])
def featured_products(request):
    """Get featured products (highest rated)."""
    products = Product.objects.filter(rating__gte=4.5).order_by('-rating')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_order(request):
    """Create a new order."""
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            {"success": True, "order_id": order.order_number}, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_server(request):
    """Simple endpoint to check if server is running."""
    return Response({"status": "online"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_orders(request):
    """Get orders for a specific user by email."""
    user_email = request.query_params.get('email')
    if not user_email:
        return Response(
            {"error": "Email parameter is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    orders = Order.objects.filter(email=user_email).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
