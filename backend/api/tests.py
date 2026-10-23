from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Category, Product, Order, OrderItem

class APITestBase(APITestCase):
    def setUp(self):
        self.category_outerwear = Category.objects.create(name="Outerwear", slug="outerwear")
        self.category_knitwear = Category.objects.create(name="Knitwear", slug="knitwear")

        self.product_jacket = Product.objects.create(
            title="Classic Denim Jacket",
            description="Timeless denim jacket with vintage wash.",
            price=Decimal("89.99"),
            discount=15,
            image="https://example.com/jacket.jpg",
            category=self.category_outerwear,
            rating=Decimal("4.8"),
            reviewCount=120,
            inStock=True
        )

        self.product_sweater = Product.objects.create(
            title="Cashmere Sweater",
            description="Soft cashmere blend sweater.",
            price=Decimal("149.99"),
            discount=0,
            image="https://example.com/sweater.jpg",
            category=self.category_knitwear,
            rating=Decimal("4.9"),
            reviewCount=85,
            inStock=True
        )

        self.product_out_of_stock = Product.objects.create(
            title="Limited Edition Coat",
            description="Rare designer coat.",
            price=Decimal("299.99"),
            discount=0,
            image="https://example.com/coat.jpg",
            category=self.category_outerwear,
            rating=Decimal("4.2"),
            reviewCount=10,
            inStock=False
        )

    def get_results(self, response_data):
        if isinstance(response_data, dict) and 'results' in response_data:
            return response_data['results']
        return response_data

class CategoryAPITests(APITestBase):
    def test_list_categories(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 2)
        category_names = [cat['name'] for cat in results]
        self.assertIn("Outerwear", category_names)
        self.assertIn("Knitwear", category_names)

class ProductAPITests(APITestBase):
    def test_list_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 3)

    def test_filter_products_by_category(self):
        url = reverse('product-list') + '?category=outerwear'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 2)
        for item in results:
            self.assertEqual(item['category_name'], 'Outerwear')

    def test_search_products(self):
        url = reverse('product-list') + '?search=Cashmere'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], "Cashmere Sweater")

    def test_filter_sale_products(self):
        url = reverse('product-list') + '?sale=true'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], "Classic Denim Jacket")

    def test_retrieve_single_product(self):
        url = reverse('product-detail', kwargs={'pk': self.product_jacket.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Classic Denim Jacket")
        self.assertEqual(response.data['price'], 89.99)

    def test_featured_products(self):
        url = reverse('featured-products')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        titles = [p['title'] for p in results]
        self.assertIn("Cashmere Sweater", titles)
        self.assertIn("Classic Denim Jacket", titles)
        self.assertNotIn("Limited Edition Coat", titles)

class OrderTransactionAPITests(APITestBase):
    def test_create_order_atomic_success(self):
        url = reverse('create-order')
        payload = {
            "first_name": "Sarah",
            "last_name": "Connor",
            "email": "sarah@example.com",
            "phone": "+1234567890",
            "address": "100 Resistance Way",
            "city": "Los Angeles",
            "state": "CA",
            "zip_code": "90001",
            "country": "USA",
            "payment_method": "credit_card",
            "total_price": "226.48",
            "items": [
                {"id": self.product_jacket.id, "quantity": 1},
                {"id": self.product_sweater.id, "quantity": 1}
            ]
        }
        initial_order_count = Order.objects.count()
        initial_item_count = OrderItem.objects.count()

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get('success'))
        self.assertTrue(response.data.get('order_id').startswith('ORD-'))

        self.assertEqual(Order.objects.count(), initial_order_count + 1)
        self.assertEqual(OrderItem.objects.count(), initial_item_count + 2)

    def test_create_order_atomic_rollback_on_out_of_stock(self):
        url = reverse('create-order')
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "address": "123 Main St",
            "city": "Dallas",
            "state": "TX",
            "zip_code": "75001",
            "country": "USA",
            "payment_method": "paypal",
            "total_price": "299.99",
            "items": [
                {"id": self.product_out_of_stock.id, "quantity": 1}
            ]
        }
        initial_order_count = Order.objects.count()

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verify transaction rolled back: order count didn't increase
        self.assertEqual(Order.objects.count(), initial_order_count)

    def test_create_order_atomic_rollback_on_invalid_product(self):
        url = reverse('create-order')
        payload = {
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice@example.com",
            "phone": "+1234567890",
            "address": "456 Elm St",
            "city": "Austin",
            "state": "TX",
            "zip_code": "78701",
            "country": "USA",
            "payment_method": "credit_card",
            "total_price": "50.00",
            "items": [
                {"id": 999999, "quantity": 1}
            ]
        }
        initial_order_count = Order.objects.count()

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), initial_order_count)

    def test_get_user_orders(self):
        order = Order.objects.create(
            order_number="ORD-USER123",
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            phone="123456",
            address="Street",
            city="City",
            state="State",
            zip_code="12345",
            country="Country",
            total_price=Decimal("89.99"),
            payment_method="card"
        )
        OrderItem.objects.create(
            order=order,
            product=self.product_jacket,
            quantity=1,
            price=Decimal("89.99")
        )

        url = reverse('user-orders') + '?email=jane@example.com'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = self.get_results(response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['order_number'], "ORD-USER123")

class HealthCheckAPITests(APITestCase):
    def test_check_server_endpoint(self):
        url = reverse('check-server')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'online')
