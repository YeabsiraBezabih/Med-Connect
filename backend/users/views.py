from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import PatientProfile, PharmacyProfile, SearchHistory
from .serializers import UserSerializer, PatientProfileSerializer, PharmacyProfileSerializer, SearchHistorySerializer
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Register a new user with profile
        """
        logger.debug(f"Registration data received: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                if user.user_type == 'patient':
                    PatientProfile.objects.create(user=user)
                elif user.user_type == 'pharmacy':
                    PharmacyProfile.objects.create(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error creating user: {str(e)}")
                return Response(
                    {"detail": f"Error creating user: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user's information
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='search-history')
    def search_history(self, request):
        histories = SearchHistory.objects.filter(user=request.user).order_by('-date')[:20]
        serializer = SearchHistorySerializer(histories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='search-history')
    def add_search_history(self, request):
        query = request.data.get('query')
        if not query:
            return Response({'error': 'Query is required.'}, status=400)
        SearchHistory.objects.create(user=request.user, query=query)
        return Response({'success': True})

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return PatientProfile.objects.none()
        if not self.request.user.is_authenticated:
            return PatientProfile.objects.none()
        if self.request.user.user_type == 'patient':
            return PatientProfile.objects.filter(user=self.request.user)
        return PatientProfile.objects.none()

class PharmacyProfileViewSet(viewsets.ModelViewSet):
    queryset = PharmacyProfile.objects.all()
    serializer_class = PharmacyProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return PharmacyProfile.objects.none()
        if not self.request.user.is_authenticated:
            return PharmacyProfile.objects.none()
        if self.request.user.user_type == 'pharmacy':
            return PharmacyProfile.objects.filter(user=self.request.user)
        return PharmacyProfile.objects.filter(is_verified=True)
