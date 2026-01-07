from rest_framework import serializers
from .models import Shop
from pricing.serializers import PricingSerializer

class ShopSerializer(serializers.ModelSerializer):
    pricings = PricingSerializer(many=True, read_only=True)
    owner_email = serializers.ReadOnlyField(source='owner.email')
    
    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ('owner', 'id', 'created_at')

class AdminShopSerializer(serializers.ModelSerializer):
    pricings = PricingSerializer(many=True, read_only=True)
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ('id', 'created_at') # owner is writable
