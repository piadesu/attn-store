from django.db import models
from django.utils import timezone

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_status = models.BooleanField(default=True) 
    description = models.TextField(blank=True, null=True)

    image = models.ImageField(upload_to='products/', blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name
    

class Inventory(models.Model):
    name = models.CharField(max_length=100)
    price = models.TextField()
    category = models.TextField()