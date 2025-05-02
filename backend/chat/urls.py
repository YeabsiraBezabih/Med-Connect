from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet

app_name = 'chat'

router = DefaultRouter()
router.register('rooms', ChatRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 