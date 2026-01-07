import uuid
from django.db import models
from django.conf import settings

class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/') 
    file_name = models.CharField(max_length=255)
    total_pages = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.file and self.total_pages == 0:
            try:
                import pypdf
                reader = pypdf.PdfReader(self.file.path)
                self.total_pages = len(reader.pages)
                super().save(update_fields=['total_pages'])
            except Exception as e:
                print(f"Error counting pages: {e}")

    def __str__(self):
        return self.file_name
