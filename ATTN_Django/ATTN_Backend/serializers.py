from rest_framework import serializers
from .models import Product
from .models import OrderProducts, OrderedItem
from .models import TransactionLists

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderedItem
        fields = '__all__'


class OrderProductsSerializer(serializers.ModelSerializer):
    items = OrderedItemSerializer(many=True, read_only=True)  # nested relationship

    class Meta:
        model = OrderProducts
        fields = '__all__'

        
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLists
        fields = '__all__'
        extra_kwargs = {
            'cus_name': {'required': False, 'allow_null': True},
            'contact_num': {'required': False, 'allow_null': True},
            'due_date': {'required': False, 'allow_null': True},
        }

