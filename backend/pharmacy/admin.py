from django.contrib import admin
from .models import Medicine, Prescription, Order, OrderItem

# Register your models here.

admin.site.register(Medicine)
admin.site.register(Prescription)
admin.site.register(Order)
admin.site.register(OrderItem)

