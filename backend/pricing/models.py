from django.db import models

class Pricing(models.Model):
    PRINT_TYPE_CHOICES = (
        ('color', 'Color'),
        ('black_white', 'Black & White'),
    )
    SIDE_CHOICES = (
        ('single', 'Single Side'),
        ('double', 'Double Side'),
    )

    shop = models.ForeignKey('shops.Shop', on_delete=models.CASCADE, related_name='pricings')
    print_type = models.CharField(max_length=20, choices=PRINT_TYPE_CHOICES)
    side = models.CharField(max_length=20, choices=SIDE_CHOICES)
    price_per_page = models.DecimalField(max_digits=6, decimal_places=2)
    binding_price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('shop', 'print_type', 'side')

    def __str__(self):
        return f"{self.shop.shop_name} - {self.print_type} - {self.side}"
