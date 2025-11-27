from rest_framework import serializers
from .models import Product
from .models import TransactionList
from .models import Ewallet
from .models import Account
from django.contrib.auth.hashers import make_password

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionList
        fields = '__all__'  # serialize all fields from the model

class EwalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ewallet
        fields = '__all__'  # serialize all fields from the model

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

    def create(self, validated_data):
        # Only allow one account
        if Account.objects.exists():
            raise serializers.ValidationError(
                "You have already created an account. Please go to Edit Profile if changes are needed."
            )

        account = Account.objects.create(**validated_data)
        return account