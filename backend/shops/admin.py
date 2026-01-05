from django.contrib import admin
from .models import Shop

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'owner', 'location', 'is_open', 'created_at')
    list_filter = ('is_open',)
    search_fields = ('shop_name', 'location', 'owner__email')
