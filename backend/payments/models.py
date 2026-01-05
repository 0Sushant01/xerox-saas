import uuid
from django.db import models

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (('upi', 'UPI'), ('card', 'Card'), ('cash', 'Cash'))
    PAYMENT_STATUS_CHOICES = (('paid', 'Paid'), ('pending', 'Pending'), ('failed', 'Failed'))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Payment for Order {self.order.id}"
