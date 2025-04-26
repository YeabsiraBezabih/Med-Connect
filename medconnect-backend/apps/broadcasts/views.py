from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import PrescriptionBroadcast, PharmacyResponse
from .serializers import (
    PrescriptionBroadcastSerializer, PharmacyResponseSerializer,
    BroadcastCreateSerializer, ResponseCreateSerializer
)

class PrescriptionBroadcastViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionBroadcastSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return PrescriptionBroadcast.objects.filter(patient=user)
        elif user.user_type == 'pharmacy':
            return PrescriptionBroadcast.objects.filter(
                Q(status='active') & 
                Q(expiry_date__gt=timezone.now())
            )
        return PrescriptionBroadcast.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BroadcastCreateSerializer
        return PrescriptionBroadcastSerializer
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        broadcast = self.get_object()
        if request.user.user_type != 'pharmacy':
            return Response(
                {'error': 'Only pharmacies can respond to broadcasts'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ResponseCreateSerializer(
            data=request.data,
            context={'request': request, 'broadcast_id': broadcast.id}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        broadcast = self.get_object()
        if request.user != broadcast.patient:
            return Response(
                {'error': 'Only the patient can cancel this broadcast'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        broadcast.status = 'cancelled'
        broadcast.save()
        return Response({'status': 'broadcast cancelled'})

class PharmacyResponseViewSet(viewsets.ModelViewSet):
    serializer_class = PharmacyResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return PharmacyResponse.objects.filter(broadcast__patient=user)
        elif user.user_type == 'pharmacy':
            return PharmacyResponse.objects.filter(pharmacy=user)
        return PharmacyResponse.objects.none()
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        response = self.get_object()
        if request.user != response.broadcast.patient:
            return Response(
                {'error': 'Only the patient can accept responses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        response.status = 'accepted'
        response.save()
        
        # Update broadcast status
        broadcast = response.broadcast
        broadcast.status = 'completed'
        broadcast.save()
        
        return Response({'status': 'response accepted'}) 