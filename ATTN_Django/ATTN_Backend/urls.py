from django.urls import path
from . import views
from .views import login_account
urlpatterns = [
    path('add-product/', views.add_product, name='add_product'),
    path('products/', views.product_list, name='product_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
    path('transactions/', views.transaction_list, name='transaction_list'),  # <- add this
    path('add-ewallet/', views.add_ewallet, name='add_ewallet'),
    path('ewallets/', views.ewallet_list, name='ewallet_list'),
    path('account/', views.signup, name='account'),
    path('login/', views.login_account, name='login'),
]