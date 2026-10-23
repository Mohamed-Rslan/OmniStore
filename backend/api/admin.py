from django.contrib import admin
from .models import Category, Product, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'discount', 'category', 'inStock')
    list_filter = ('category', 'inStock')
    search_fields = ('title', 'description')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'first_name', 'last_name', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'country')
    search_fields = ('order_number', 'first_name', 'last_name', 'email')
    inlines = [OrderItemInline]
