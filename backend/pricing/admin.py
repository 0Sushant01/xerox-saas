from django.contrib import admin
from .models import Pricing

@admin.register(Pricing)
class PricingAdmin(admin.ModelAdmin):
    list_display = ('shop', 'print_type', 'side', 'price_per_page', 'binding_price')
    list_filter = ('shop', 'print_type')
