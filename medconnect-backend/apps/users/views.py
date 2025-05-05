from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import PharmacyProfile, PatientProfile, MedicineInventory
from .serializers import (
    UserSerializer, PharmacyProfileSerializer, PatientProfileSerializer,
    UserRegistrationSerializer, MedicineInventorySerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        headers = self.get_success_headers(serializer.data)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(access),
        }, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PharmacyProfileViewSet(viewsets.ModelViewSet):
    queryset = PharmacyProfile.objects.all()
    serializer_class = PharmacyProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'pharmacy':
            return PharmacyProfile.objects.filter(user=self.request.user)
        return PharmacyProfile.objects.all()
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        pharmacy = self.get_object()
        pharmacy.is_verified = True
        pharmacy.save()
        return Response({'status': 'pharmacy verified'})

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'patient':
            return PatientProfile.objects.filter(user=self.request.user)
        return PatientProfile.objects.none()

class MedicineInventoryViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineInventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'pharmacy':
            return MedicineInventory.objects.filter(pharmacy=self.request.user)
        return MedicineInventory.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(pharmacy=self.request.user)
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        queryset = self.get_queryset().filter(expiry_date__lt=timezone.now().date())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        # Get medicines expiring in the next 30 days
        thirty_days_from_now = timezone.now().date() + timezone.timedelta(days=30)
        queryset = self.get_queryset().filter(
            expiry_date__gt=timezone.now().date(),
            expiry_date__lte=thirty_days_from_now
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data) 