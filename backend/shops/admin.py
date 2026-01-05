from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Shop

User = get_user_model()

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'owner', 'location', 'is_open', 'created_at')
    list_filter = ('is_open', 'created_at')
    search_fields = ('shop_name', 'location', 'owner__email')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "owner":
            kwargs["queryset"] = User.objects.filter(role='shop_owner')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
