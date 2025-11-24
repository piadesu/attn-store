from django.shortcuts import render
from django.http import JsonResponse
from ATTN_Backend.models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Product
from .serializers import ProductSerializer


def website_description(request):
    # Fetch all recipes from the database
    recipes = Product.objects.all().values()  # .values() returns dictionaries of each record

    # Convert queryset to a list so JsonResponse can serialize it
    recipes_list = list(recipes)

    # Return JSON response
    return JsonResponse({"recipes": recipes_list})

@api_view(['POST'])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
