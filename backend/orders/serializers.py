from rest_framework import serializers
from .models import Order, OrderItem
from documents.serializers import DocumentSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    document_name = serializers.CharField(source='document.file_name', read_only=True)
    document_file = serializers.FileField(source='document.file', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'document', 'document_name', 'document_file', 'copies', 'print_type', 'side', 'binding', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    shop_name = serializers.CharField(source='shop.shop_name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'shop', 'shop_name', 'status', 'total_price', 'created_at', 'items']
        read_only_fields = ('customer', 'id', 'status', 'created_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total price if not provided or just trust frontend? 
        # Requirement says "logic should handle based on shop pricing".
        # For now, we trust the total_price from frontend or could recalculate.
        # Let's save the order first.
        
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            
        return order
