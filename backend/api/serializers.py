import uuid
from django.db import transaction
from rest_framework import serializers
from .models import Category, Product, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    price = serializers.FloatField()  # Convert Decimal to float for JSON compatibility
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'discount', 
            'image', 'category', 'category_name', 'rating', 
            'reviewCount', 'inStock', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'product_image', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'first_name', 'last_name', 'email',
            'phone', 'address', 'apartment', 'city', 'state', 'zip_code',
            'country', 'status', 'total_price', 'payment_method',
            'created_at', 'items'
        ]
        read_only_fields = ['id', 'order_number', 'created_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(), 
        write_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'address', 'apartment', 'city', 'state', 'zip_code',
            'country', 'payment_method', 'total_price', 'items'
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate a unique order identifier
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order.objects.create(order_number=order_number, **validated_data)
        
        for item_data in items_data:
            product_id = item_data.get('id')
            quantity = item_data.get('quantity', 1)
            
            if not product_id:
                raise serializers.ValidationError({"items": "Each item must have a valid product id."})
                
            try:
                product = Product.objects.select_for_update().get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError({"items": f"Product with id {product_id} does not exist."})
                
            if not product.inStock:
                raise serializers.ValidationError({"items": f"Product '{product.title}' is currently out of stock."})
                
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.discounted_price
            )
            
        return order
