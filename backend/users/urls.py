from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, PatientProfileViewSet, PharmacyProfileViewSet
from rest_framework.decorators import action

app_name = 'users'

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('patient-profiles', PatientProfileViewSet)
router.register('pharmacy-profiles', PharmacyProfileViewSet)

urlpatterns = [
    # JWT authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Direct search-history endpoints
    path('search-history/', UserViewSet.as_view({'get': 'search_history', 'post': 'add_search_history'}), name='search-history'),
    # API endpoints
    path('', include(router.urls)),
] 