from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, generics

from django.contrib.auth.hashers import make_password, check_password

from .models import (
    Product, Category,
    OrderProducts, OrderedItem,
    Ewallet, Account
)

from .serializers import (
    ProductSerializer, CategorySerializer,
    EwalletSerializer, AccountSerializer,
    OrderProductsSerializer, OrderedItemSerializer
)

# --------------------------
# CATEGORY VIEW
# --------------------------

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# --------------------------
# PRODUCT VIEWS
# --------------------------

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


# --------------------------
# ORDER VIEWS
# --------------------------

@api_view(['GET'])
def order_list(request):
    orders = OrderProducts.objects.all()
    serializer = OrderProductsSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_order(request):
    """
    Creates an order AND its ordered items.
    No TransactionList is used anymore.
    """

    order_data = {
        "status": request.data.get("status"),
        "cus_name": request.data.get("cus_name"),
        "contact_num": request.data.get("contact_num"),
        "total_amt": request.data.get("total_amt"),
        "due_date": request.data.get("due_date"),
    }

    order_serializer = OrderProductsSerializer(data=order_data)

    if order_serializer.is_valid():
        order = order_serializer.save()

        # Create ordered items manually
        items = request.data.get("items", [])
        for item in items:
            OrderedItem.objects.create(
                order=order,
                product_name=item.get("product_name"),
                qty=item.get("qty"),
                price=item.get("price"),
                subtotal=item.get("subtotal"),
                cost_price=item.get("cost_price"),
                selling_price=item.get("selling_price"),
            )

        return Response(OrderProductsSerializer(order).data, status=201)

    print(order_serializer.errors)
    return Response(order_serializer.errors, status=400)


# --------------------------
# EWALLET VIEWS
# --------------------------

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


# --------------------------
# ACCOUNT AUTH
# --------------------------

@api_view(["POST"])
def signup(request):
    first_name = request.data.get("FIRST_NAME")
    middle_name = request.data.get("MIDDLE_NAME")
    last_name = request.data.get("LAST_NAME")
    username = request.data.get("USERNAME")
    password = request.data.get("PASSWORD")
    date_of_birth = request.data.get("DATE_OF_BIRTH")

    if Account.objects.filter(USERNAME=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    account = Account(
        USERNAME=username,
        FIRST_NAME=first_name,
        MIDDLE_NAME=middle_name,
        LAST_NAME=last_name,
        DATE_OF_BIRTH=date_of_birth,
    )
    account.set_password(password)
    account.save()

    return Response({"message": "Account created successfully"}, status=201)


@api_view(["POST"])
def login_account(request):
    username = request.data.get("USERNAME")
    password = request.data.get("PASSWORD")

    try:
        account = Account.objects.get(USERNAME=username)
    except Account.DoesNotExist:
        return Response({"error": "Invalid username or password"}, status=400)

    if not account.check_password(password):
        return Response({"error": "Invalid username or password"}, status=400)

    return Response({
        "message": "Login successful",
        "username": account.USERNAME,
        "first_name": account.FIRST_NAME,
        "last_name": account.LAST_NAME
    })
@api_view(['GET'])
def website_description(request):
    products = Product.objects.all().values()
    return Response({"recipes": list(products)})

@api_view(["PATCH"])
def update_order_status(request, pk):
    try:
        order = OrderProducts.objects.get(order_id=pk)
    except OrderProducts.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    new_status = request.data.get("status")

    if new_status not in ["Pending", "Paid"]:
        return Response({"error": "Invalid status"}, status=400)

    order.status = new_status
    order.save()

    return Response({
        "message": "Order status updated",
        "order_id": order.order_id,
        "status": order.status,
    })

