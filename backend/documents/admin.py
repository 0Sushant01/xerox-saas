from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'user', 'total_pages', 'uploaded_at')
    search_fields = ('file_name', 'user__email')
