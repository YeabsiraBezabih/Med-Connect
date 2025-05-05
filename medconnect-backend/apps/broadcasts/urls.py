from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'broadcasts', views.PrescriptionBroadcastViewSet, basename='broadcast')
router.register(r'responses', views.PharmacyResponseViewSet, basename='response')
router.register( 'pharmacy/near-expiry-drugs', views.PharmacyResponseForExpiryDrugsViewSet, basename='near-expiry-drugs')

urlpatterns = [
    path('', include(router.urls)),
] 