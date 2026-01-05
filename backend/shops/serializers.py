from rest_framework import serializers
from .models import Shop
from pricing.serializers import PricingSerializer

class ShopSerializer(serializers.ModelSerializer):
    pricings = PricingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ('owner', 'id', 'created_at')
