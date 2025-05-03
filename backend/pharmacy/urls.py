from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, PrescriptionViewSet, OrderViewSet

app_name = 'pharmacy'

router = DefaultRouter()
router.register('medicines', MedicineViewSet)
router.register('prescriptions', PrescriptionViewSet)
router.register('orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 