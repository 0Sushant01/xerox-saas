from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PricingViewSet, BindingPricingViewSet, PriceCalculationView

router = DefaultRouter()
router.register(r'binding', BindingPricingViewSet, basename='binding-pricing')
router.register(r'', PricingViewSet, basename='pricing')

urlpatterns = [
    path('calculate-price/', PriceCalculationView.as_view(), name='calculate-price'),
    path('', include(router.urls)),
]
