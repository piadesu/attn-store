from django.urls import path
from . import views

urlpatterns = [
    path('add-product/', views.add_product, name='add_product'),
    path('products/', views.product_list, name='product_list'),
    path('orders/', views.order_list, name='order_list'),
    path('create-order/', views.create_order, name='create_order'),
    path('transactions/', views.get_transactions, name='transactions'),
    path('transactions/create/', views.create_transaction, name='create_transaction'),
    path("transactions/update/<int:trans_id>/", views.update_transaction_status),


]