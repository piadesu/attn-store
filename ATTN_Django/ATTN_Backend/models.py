from django.db import models
from django.utils import timezone

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_status = models.BooleanField(default=True) 
    is_active = models.BooleanField(default=True)


    image = models.ImageField(upload_to='products/', blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name
    

class Inventory(models.Model):
    name = models.CharField(max_length=100)
    price = models.TextField()
    category = models.TextField()

