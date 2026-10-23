from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('featured-products/', views.featured_products, name='featured-products'),
    path('create-order/', views.create_order, name='create-order'),
    path('check-server/', views.check_server, name='check-server'),
    path('user-orders/', views.get_user_orders, name='user-orders'),
]
