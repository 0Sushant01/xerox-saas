import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Shop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shops')
    shop_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Ensure the owner has the 'shop_owner' role
        if self.owner and self.owner.role != 'shop_owner':
            raise ValidationError({'owner': "The selected user must have the role 'Shop Owner'."})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.shop_name
