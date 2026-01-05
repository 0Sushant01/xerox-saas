from django.test import TestCase
from django.contrib.auth import get_user_model
from shops.models import Shop
from .models import Pricing, BindingPricing
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal

User = get_user_model()

class BindingPricingTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testowner', password='password', role='shop_owner')
        self.shop = Shop.objects.create(owner=self.user, shop_name='Test Shop', location='Test Loc')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_binding_pricing(self):
        bp = BindingPricing.objects.create(shop=self.shop, binding_type='soft', price=50.00)
        self.assertEqual(bp.binding_type, 'soft')
        self.assertEqual(bp.price, 50.00)

    def test_unique_constraint(self):
        BindingPricing.objects.create(shop=self.shop, binding_type='soft', price=50.00)
        with self.assertRaises(Exception):
            BindingPricing.objects.create(shop=self.shop, binding_type='soft', price=60.00)

    def test_api_create_binding(self):
        data = {'binding_type': 'hard', 'price': '100.00'}
        response = self.client.post('/pricing/binding/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BindingPricing.objects.count(), 1)
        self.assertEqual(BindingPricing.objects.get().price, Decimal('100.00'))

    def test_calculate_price(self):
        # Setup pricing
        Pricing.objects.create(shop=self.shop, print_type='color', side='single', price_per_page=10.00)
        BindingPricing.objects.create(shop=self.shop, binding_type='soft', price=50.00)

        data = {
            'shop_id': self.shop.id,
            'print_type': 'color',
            'side': 'single',
            'pages': 10,
            'binding_type': 'soft'
        }
        
        # Logout to test public access if allowed, or keep logged in. View allows IsAll?
        # PriceCalculationView has permission_classes = [permissions.AllowAny]
        self.client.logout()
        
        response = self.client.post('/pricing/calculate-price/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_print = 10 * 10.00 # 100
        expected_binding = 50.00
        expected_total = 150.00
        
        self.assertEqual(Decimal(response.data['print_cost']), Decimal(expected_print))
        self.assertEqual(Decimal(response.data['binding_cost']), Decimal(expected_binding))
        self.assertEqual(Decimal(response.data['total_cost']), Decimal(expected_total))
