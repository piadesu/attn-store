from django.db import models
from django.utils import timezone
from datetime import date
from django.contrib.auth.hashers import make_password, check_password


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    stock = models.IntegerField(default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock_status = models.BooleanField(default=True) 
    is_active = models.BooleanField(default=True)

    image = models.ImageField(upload_to='products/', blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'ATTN_Backend_product'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Convert product name to lowercase before saving
        self.name = self.name.lower()
        super().save(*args, **kwargs)

class Inventory(models.Model):
    name = models.CharField(max_length=100)
    price = models.TextField()
    category = models.TextField()

from django.db import models

class TransactionList(models.Model):
    trans_list_id = models.BigAutoField(primary_key=True, db_column='TRANS_LIST_ID')
 
    

    class Meta:
        db_table = 'ATTN_Backend_transaction_list'

    def __str__(self):
        return f"{self.customer} - Order {self.order_id}"


class Ewallet(models.Model):
    EWALL_ID = models.BigAutoField(primary_key=True)
    EWALL_APP = models.CharField(max_length=255)
    EWALL_TYPE = models.CharField(max_length=255)
    EWALL_DATE = models.DateField(null=True, blank=True, default=date.today)
    EWALL_ACC_NAME = models.CharField(max_length=255, null=True, blank=True)
    EWAL_NUM = models.CharField(max_length=255, null=True, blank=True)
    EWALL_AMOUNT = models.BigIntegerField(null=True, blank=True)
    EWALL_FEE = models.BigIntegerField(null=True, blank=True)
    EWALL_TOTAL = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'ATTN_Backend_ewallet'

    def __str__(self):
        return f"{self.ewall_app} - {self.ewall_acc_name} ({self.ewal_num})"
    
class Account(models.Model):
    USER_ID = models.BigAutoField(primary_key=True)

    FIRST_NAME = models.CharField(max_length=255)
    MIDDLE_NAME = models.CharField(max_length=255, null=True, blank=True)
    LAST_NAME = models.CharField(max_length=255)

    USERNAME = models.CharField(max_length=255, unique=True)

    DATE_OF_BIRTH = models.DateField(null=True, blank=True)

    PASSWORD = models.CharField(max_length=255)  # store hashed password

    
    def set_password(self, raw_password):
        self.PASSWORD = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.PASSWORD)


    class Meta:
        db_table = 'ATTN_Backend_accounts'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"