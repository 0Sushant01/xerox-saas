from rest_framework import serializers
from .models import Pricing

class PricingSerializer(serializers.ModelSerializer):
    def validate_price_per_page(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    class Meta:
        model = Pricing
        fields = ['id', 'print_type', 'side', 'price_per_page', 'binding_price', 'shop']
        read_only_fields = ['shop']
