from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.generic import RedirectView

# Simple view for the root URL
def api_root(request):
    return JsonResponse({
        'status': 'online',
        'message': 'OmniStore API server is running',
        'endpoints': {
            'products': '/api/products/',
            'categories': '/api/categories/',
            'featured_products': '/api/featured-products/',
            'check_server': '/api/check-server/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', api_root, name='api-root'),  # Root URL pattern
]
