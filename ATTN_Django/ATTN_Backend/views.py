from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from rest_framework.views import APIView

from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password


from .models import Product
from .models import Category
from .serializers import ProductSerializer
from .serializers import CategorySerializer

from .models import TransactionList
from .serializers import TransactionSerializer

from .models import Ewallet
from .serializers import EwalletSerializer

from .models import Account
from .serializers import AccountSerializer

from django.http import JsonResponse
from .models import Product

def website_description(request):
    # Fetch all recipes from the database
    recipes = Product.objects.all().values()  # .values() returns dictionaries of each record

    # Convert queryset to a list so JsonResponse can serialize it
    recipes_list = list(recipes)

    # Return JSON response
    return JsonResponse({"recipes": recipes_list})

class CategoryListCreateview(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_product(request):
    
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def product_list(request):
    products = Product.objects.filter(is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PATCH'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    if request.method == "PATCH":
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['GET'])
def transaction_list(request):
    transactions = TransactionList.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_ewallet(request):
    serializer = EwalletSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def ewallet_list(request):
    ewallets = Ewallet.objects.all()
    serializer = EwalletSerializer(ewallets, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def signup(request):
    first_name = request.data.get("FIRST_NAME")  # <-- match the frontend
    last_name = request.data.get("LAST_NAME")
    username = request.data.get("USERNAME")
    password = request.data.get("PASSWORD")
    middle_name = request.data.get("MIDDLE_NAME")
    date_of_birth = request.data.get("DATE_OF_BIRTH")

    # Check if username already exists (using the correct field name)
    if Account.objects.filter(USERNAME=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    # Create account using the correct field names
    account = Account(
        USERNAME=username,
        FIRST_NAME=first_name,
        MIDDLE_NAME=middle_name,
        LAST_NAME=last_name,
        DATE_OF_BIRTH=date_of_birth
    )
    # Hash password using your model's method
    account.set_password(password)  
    account.save()

    return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
    

@api_view(["POST"])
def login_account(request):
    username = request.data.get("USERNAME")
    password = request.data.get("PASSWORD")

    try:
        account = Account.objects.get(USERNAME=username)  # match your model field
    except Account.DoesNotExist:
        return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

    if not account.check_password(password):
        return Response({"error": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "message": "Login successful",
        "username": account.USERNAME,
        "first_name": account.FIRST_NAME,
        "last_name": account.LAST_NAME
    })