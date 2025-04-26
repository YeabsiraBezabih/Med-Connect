from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'broadcasts', views.PrescriptionBroadcastViewSet, basename='broadcast')
router.register(r'responses', views.PharmacyResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
] 