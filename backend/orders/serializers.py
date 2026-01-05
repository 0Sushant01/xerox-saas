from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('customer', 'id', 'status') 
        # total_price is allowed to be set by frontend for MVP simple logic, or make read_only if calculated.
        # Making it writable for MVP flexibility as requested ("Place order").
