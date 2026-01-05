from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Pricing, BindingPricing
from .serializers import PricingSerializer, BindingPricingSerializer
from django.shortcuts import get_object_or_404
from shops.models import Shop
from decimal import Decimal

class IsShopOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'shop_owner'

class PricingViewSet(viewsets.ModelViewSet):
    serializer_class = PricingSerializer
    permission_classes = [IsShopOwner]

    def get_queryset(self):
        # Only show pricing for the logged-in shop owner's shop
        # Assuming one shop per owner for MVP
        if self.request.user.is_authenticated:
            return Pricing.objects.filter(shop__owner=self.request.user)
        return Pricing.objects.none()

    def create(self, request, *args, **kwargs):
        # Custom create logic to handle "Update if exists"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_shop = self.request.user.shops.first()
        if not user_shop:
             return Response({"detail": "You do not have a shop."}, status=status.HTTP_400_BAD_REQUEST)

        print_type = serializer.validated_data.get('print_type')
        side = serializer.validated_data.get('side')
        
        # Check if pricing rule already exists
        pricing, created = Pricing.objects.update_or_create(
            shop=user_shop,
            print_type=print_type,
            side=side,
            defaults={
                'price_per_page': serializer.validated_data.get('price_per_page'),
                'binding_price': serializer.validated_data.get('binding_price', 0)
            }
        )

        # Re-serialize to return standarized data
        response_serializer = self.get_serializer(pricing)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def perform_create(self, serializer):
        # Fallback if create wasn't overridden, but we did override `create`, so this might not be called by `create` 
        # unless we called super().create(). But we didn't.
        # This is strictly for ViewSet structure compliance if needed or basic ModelViewSet usage.
        user_shop = self.request.user.shops.first()
        if user_shop:
            serializer.save(shop=user_shop)


class BindingPricingViewSet(viewsets.ModelViewSet):
    serializer_class = BindingPricingSerializer
    permission_classes = [IsShopOwner]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return BindingPricing.objects.filter(shop__owner=self.request.user)
        return BindingPricing.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_shop = self.request.user.shops.first()
        if not user_shop:
             return Response({"detail": "You do not have a shop."}, status=status.HTTP_400_BAD_REQUEST)

        binding_type = serializer.validated_data.get('binding_type')
        
        binding_pricing, created = BindingPricing.objects.update_or_create(
            shop=user_shop,
            binding_type=binding_type,
            defaults={
                'price': serializer.validated_data.get('price')
            }
        )
        
        response_serializer = self.get_serializer(binding_pricing)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def perform_create(self, serializer):
        user_shop = self.request.user.shops.first()
        if user_shop:
            serializer.save(shop=user_shop)


class PriceCalculationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        shop_id = request.data.get('shop_id')
        print_type = request.data.get('print_type')
        side = request.data.get('side')
        pages = request.data.get('pages', 0)
        binding_type = request.data.get('binding_type')

        if not all([shop_id, print_type, side]):
            print(f"Missing fields: {shop_id}, {print_type}, {side}")
            return Response({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pages = int(pages)
        except ValueError:
             return Response({"detail": "Pages must be a number"}, status=status.HTTP_400_BAD_REQUEST)

        print_pricing = Pricing.objects.filter(shop=shop_id, print_type=print_type, side=side).first()
        
        if not print_pricing:
            # Fallback debug
            return Response({"detail": "Pricing not found for this configuration"}, status=status.HTTP_404_NOT_FOUND)
            
        print_cost = print_pricing.price_per_page * Decimal(pages)
        binding_cost = Decimal('0.00')

        if binding_type:
            binding_pricing = BindingPricing.objects.filter(shop=shop_id, binding_type=binding_type).first()
            if binding_pricing:
                binding_cost = binding_pricing.price
        
        total_cost = print_cost + binding_cost
        
        return Response({
            "print_cost": print_cost,
            "binding_cost": binding_cost,
            "total_cost": total_cost
        })
