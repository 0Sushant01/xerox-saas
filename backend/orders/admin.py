from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'shop', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'shop')
    search_fields = ('id', 'customer__email', 'shop__shop_name')
