from django.urls import path
from . import views   # CORRECT IMPORT

urlpatterns = [
    path('add-product/', views.add_product),
    path('products/', views.product_list),
    path('products/<int:pk>/', views.product_detail),

    path('categories/', views.CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', views.CategoryListCreateView.as_view()),

    path('add-ewallet/', views.add_ewallet),
    path('ewallets/', views.ewallet_list),

    path('account/', views.signup),
    path('login/', views.login_account),

    path('orders/', views.order_list),
    path('create-order/', views.create_order),
    path('orders/<int:pk>/', views.update_order_status),
]
