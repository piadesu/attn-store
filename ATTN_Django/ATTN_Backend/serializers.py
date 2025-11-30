from rest_framework import serializers
from .models import Product, Category, OrderProducts, OrderedItem, Ewallet, Account

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_display_name(self, obj):
        return obj.name.title()


class EwalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ewallet
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class OrderedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderedItem
        fields = '__all__'


class OrderProductsSerializer(serializers.ModelSerializer):
    items = OrderedItemSerializer(many=True, read_only=True)

    class Meta:
        model = OrderProducts
        fields = '__all__'
