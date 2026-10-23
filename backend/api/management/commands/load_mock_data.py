from django.core.management.base import BaseCommand
from api.models import Category, Product

class Command(BaseCommand):
    help = 'Load mock product data from frontend into the database'

    def handle(self, *args, **kwargs):
        # Mock product data from frontend
        mock_products = [
            {
                "id": 1,
                "title": "Classic Denim Jacket",
                "description": "Timeless denim jacket with a comfortable fit and vintage wash. Perfect for layering over any outfit.",
                "price": 89.99,
                "discount": 15,
                "image": "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
                "category": "Outerwear",
                "rating": 4.8,
                "reviewCount": 243,
                "inStock": True
            },
            {
                "id": 2,
                "title": "Slim-Fit Chino Pants",
                "description": "Modern slim-fit chino pants made from premium cotton. Versatile style for casual and semi-formal occasions.",
                "price": 59.99,
                "discount": 0,
                "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1397&q=80",
                "category": "Pants",
                "rating": 4.5,
                "reviewCount": 189,
                "inStock": True
            },
            {
                "id": 3,
                "title": "Leather Crossbody Bag",
                "description": "Handcrafted genuine leather crossbody bag with adjustable strap and multiple compartments for organization.",
                "price": 129.99,
                "discount": 10,
                "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80",
                "category": "Accessories",
                "rating": 4.7,
                "reviewCount": 112,
                "inStock": True
            },
            {
                "id": 4,
                "title": "Cashmere Blend Sweater",
                "description": "Luxuriously soft cashmere blend sweater with ribbed cuffs and hem. Perfect for staying cozy in style.",
                "price": 149.99,
                "discount": 20,
                "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1372&q=80",
                "category": "Knitwear",
                "rating": 4.6,
                "reviewCount": 87,
                "inStock": True
            },
            {
                "id": 5,
                "title": "Floral Maxi Dress",
                "description": "Elegant floral print maxi dress with a flattering silhouette. Perfect for summer occasions and beach vacations.",
                "price": 79.99,
                "discount": 0,
                "image": "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
                "category": "Dresses",
                "rating": 4.9,
                "reviewCount": 321,
                "inStock": False
            },
            {
                "id": 6,
                "title": "Premium Silk Blouse",
                "description": "Elegant silk blouse with a relaxed fit and button-up front. Effortlessly transitions from work to evening wear.",
                "price": 119.99,
                "discount": 0,
                "image": "https://images.pexels.com/photos/6765185/pexels-photo-6765185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "category": "Tops",
                "rating": 4.4,
                "reviewCount": 98,
                "inStock": True
            },
            {
                "id": 7,
                "title": "Tailored Wool Blazer",
                "description": "Sophisticated tailored wool blazer with a modern fit. A timeless addition to any professional wardrobe.",
                "price": 199.99,
                "discount": 10,
                "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80",
                "category": "Outerwear",
                "rating": 4.9,
                "reviewCount": 76,
                "inStock": True
            },
            {
                "id": 8,
                "title": "Vintage Graphic T-Shirt",
                "description": "Soft, comfortable vintage-inspired graphic t-shirt made from premium cotton. Perfect for casual everyday wear.",
                "price": 29.99,
                "discount": 0,
                "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
                "category": "Tops",
                "rating": 4.3,
                "reviewCount": 145,
                "inStock": True
            },
            {
                "id": 9,
                "title": "High-Waisted Skinny Jeans",
                "description": "Figure-flattering high-waisted skinny jeans with stretch for ultimate comfort and mobility.",
                "price": 69.99,
                "discount": 0,
                "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                "category": "Pants",
                "rating": 4.6,
                "reviewCount": 208,
                "inStock": True
            },
            {
                "id": 10,
                "title": "Patterned Summer Shorts",
                "description": "Lightweight and breathable summer shorts with playful patterns. Perfect for beach days and casual outings.",
                "price": 44.99,
                "discount": 25,
                "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
                "category": "Shorts",
                "rating": 4.4,
                "reviewCount": 67,
                "inStock": True
            },
            {
                "id": 11,
                "title": "Premium Leather Sneakers",
                "description": "Handcrafted premium leather sneakers with cushioned insoles for all-day comfort. Versatile style for any casual outfit.",
                "price": 129.99,
                "discount": 0,
                "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=698&q=80",
                "category": "Shoes",
                "rating": 4.8,
                "reviewCount": 123,
                "inStock": True
            },
            {
                "id": 12,
                "title": "Designer Sunglasses",
                "description": "Polarized designer sunglasses with 100% UV protection. Stylish frames that complement any face shape.",
                "price": 159.99,
                "discount": 15,
                "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                "category": "Accessories",
                "rating": 4.5,
                "reviewCount": 89,
                "inStock": True
            }
        ]
        
        # Track already created categories
        categories = {}
        
        # First, create all the categories
        self.stdout.write(self.style.SUCCESS('Creating categories...'))
        for product_data in mock_products:
            category_name = product_data['category']
            if category_name not in categories:
                # Generate slug from category name
                slug = category_name.lower().replace(' ', '-')
                category, created = Category.objects.get_or_create(
                    name=category_name,
                    defaults={'slug': slug}
                )
                categories[category_name] = category
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created category: {category_name}'))
                else:
                    self.stdout.write(f'Category already exists: {category_name}')
        
        # Then create all the products
        self.stdout.write(self.style.SUCCESS('Creating products...'))
        for product_data in mock_products:
            # Get the corresponding category
            category = categories[product_data['category']]
            
            # Check if product already exists
            product, created = Product.objects.get_or_create(
                id=product_data['id'],
                defaults={
                    'title': product_data['title'],
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'discount': product_data['discount'],
                    'image': product_data['image'],
                    'category': category,
                    'rating': product_data['rating'],
                    'reviewCount': product_data['reviewCount'],
                    'inStock': product_data['inStock'],
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product_data["title"]}'))
            else:
                self.stdout.write(f'Product already exists: {product_data["title"]}')
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded mock product data!'))
