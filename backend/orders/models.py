import uuid
from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('printing', 'Printing'),
        ('ready', 'Ready'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    shop = models.ForeignKey('shops.Shop', on_delete=models.CASCADE, related_name='orders')
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"


class OrderItem(models.Model):
    PRINT_TYPE_CHOICES = (('color', 'Color'), ('black_white', 'Black & White'))
    SIDE_CHOICES = (('single', 'Single Side'), ('double', 'Double Side'))
    BINDING_CHOICES = (('none', 'None'), ('spiral', 'Spiral'), ('hard', 'Hard'))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    document = models.ForeignKey('documents.Document', on_delete=models.CASCADE)
    
    copies = models.IntegerField(default=1)
    print_type = models.CharField(max_length=20, choices=PRINT_TYPE_CHOICES)
    side = models.CharField(max_length=20, choices=SIDE_CHOICES)
    binding = models.CharField(max_length=20, choices=BINDING_CHOICES, default='none')
    
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.id} for Order {self.order.id}"

    def __str__(self):
        return f"Order {self.id} - {self.status}"
