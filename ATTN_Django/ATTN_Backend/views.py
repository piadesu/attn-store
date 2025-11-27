from django.shortcuts import render
from django.http import JsonResponse
from ATTN_Backend.models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Product
from .serializers import ProductSerializer
from .models import OrderProducts, OrderedItem, TransactionLists
from .serializers import OrderProductsSerializer, OrderedItemSerializer, TransactionSerializer

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

@api_view(['GET'])
def order_list(request):
    orders = OrderProducts.objects.all()
    serializer = OrderProductsSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_order(request):

    # Extract OrderProducts fields manually (NOT including items)
    order_data = {
        "status": request.data.get("status"),
        "cus_name": request.data.get("cus_name"),
        "contact_num": request.data.get("contact_num"),
        "total_amt": request.data.get("total_amt"),
        "due_date": request.data.get("due_date"),
    }

    # Validate ONLY order fields
    order_serializer = OrderProductsSerializer(data=order_data)

    if order_serializer.is_valid():
        order = order_serializer.save()

        # Save ordered items (manual create)
        items = request.data.get("items", [])
        for item in items:
            OrderedItem.objects.create(
                order=order,
                product_name=item.get("product_name"),
                qty=item.get("qty"),
                price=item.get("price"),
                subtotal=item.get("subtotal")
            )

        # Create transaction entry
        TransactionLists.objects.create(
            order=order,
            status=order.status,
            cus_name=order.cus_name,
            contact_num=order.contact_num,
            total_amt=order.total_amt,
            due_date=order.due_date
        )

        return Response(OrderProductsSerializer(order).data, status=201)

    print(order_serializer.errors)  # Debug
    return Response(order_serializer.errors, status=400)



@api_view(['POST'])
def create_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        transaction = serializer.save()
        return Response(TransactionSerializer(transaction).data, status=201)

   # show exact reason
    print("TRANSACTION ERROR:", serializer.errors)

    return Response(serializer.errors, status=400)

        
  
@api_view(['GET'])
def get_transactions(request):
    transactions = TransactionLists.objects.all().order_by('-trans_id')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)
@api_view(['PATCH'])
def update_transaction_status(request, trans_id):
    try:
        transaction = TransactionLists.objects.get(trans_id=trans_id)
    except TransactionLists.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)

    new_status = request.data.get("status")

    if new_status not in ["Paid", "Pending"]:
        return Response({"error": "Invalid status"}, status=400)

    # Update TransactionLists
    transaction.status = new_status
    transaction.save()

    # Update OrderProducts
    order = transaction.order
    order.status = new_status
    order.save()

    return Response({"message": "Status updated!"})
