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
    




class OrderProducts(models.Model):
    order_id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50)
    cus_name = models.CharField(max_length=255, null=True, blank=True)
    contact_num = models.CharField(max_length=50, null=True, blank=True)
    total_amt = models.FloatField()
    due_date = models.DateField(null=True, blank=True)


    def __str__(self):
        return f"Order #{self.order_id} - {self.cus_name}"

class OrderedItem(models.Model):
    order = models.ForeignKey(OrderProducts, on_delete=models.CASCADE, related_name="items")
    product_name = models.CharField(max_length=255)
    qty = models.IntegerField()
    price = models.FloatField()
    subtotal = models.FloatField()
    cost_price = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)

class TransactionLists(models.Model):
    trans_id = models.AutoField(primary_key=True)
    order = models.ForeignKey('OrderProducts', on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    cus_name = models.CharField(max_length=255, null=True, blank=True)
    contact_num = models.CharField(max_length=50, null=True, blank=True)
    total_amt = models.FloatField()
    transaction_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
      return f"Transaction #{self.trans_id} for Order #{self.order.order_id}"
