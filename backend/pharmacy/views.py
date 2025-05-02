from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F, FloatField
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models.functions import ACos, Cos, Radians, Sin
from .models import Medicine, Prescription, Order, OrderItem
from .serializers import MedicineSerializer, PrescriptionSerializer, OrderSerializer, OrderItemSerializer

# Create your views here.

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search_nearby']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return Medicine.objects.none()
        # Only restrict to pharmacy's own medicines for authenticated pharmacy users in the dashboard
        if self.action == 'list' and self.request.user.is_authenticated and self.request.user.user_type == 'pharmacy' and self.request.resolver_match.route == 'pharmacy/medicines/':
            return Medicine.objects.filter(pharmacy=self.request.user.pharmacy_profile)
        # For public or user search, return all medicines
        return Medicine.objects.all()

    @action(detail=False, methods=['get'])
    def search_nearby(self, request):
        """
        Search for medicines near a specific location
        """
        name = request.query_params.get('name', '')
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = float(request.query_params.get('radius', 10.0))  # Default 10km radius
        
        if not all([name, lat, lng]):
            return Response(
                {'error': 'Name, latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            lat = float(lat)
            lng = float(lng)
        except ValueError:
            return Response(
                {'error': 'Invalid latitude or longitude'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate distance using Haversine formula with explicit output_field
        distance_formula = (
            6371.0 * ACos(
                Cos(Radians(lat, output_field=FloatField())) * 
                Cos(Radians(F('pharmacy__latitude'), output_field=FloatField())) * 
                Cos(Radians(F('pharmacy__longitude'), output_field=FloatField()) - Radians(lng, output_field=FloatField())) + 
                Sin(Radians(lat, output_field=FloatField())) * Sin(Radians(F('pharmacy__latitude'), output_field=FloatField())),
                output_field=FloatField()
            )
        )

        queryset = Medicine.objects.annotate(
            distance=distance_formula
        ).filter(
            name__icontains=name,
            distance__lte=radius
        ).select_related('pharmacy').order_by('distance')

        # Include pharmacy information in the response
        results = []
        for medicine in queryset:
            results.append({
                'id': medicine.id,
                'name': medicine.name,
                'price': medicine.price,
                'stock': medicine.stock,
                'requires_prescription': medicine.requires_prescription,
                'pharmacy': {
                    'id': medicine.pharmacy.id,
                    'name': medicine.pharmacy.business_name,
                    'address': medicine.pharmacy.address,
                    'phone': medicine.pharmacy.phone_number,
                    'latitude': medicine.pharmacy.latitude,
                    'longitude': medicine.pharmacy.longitude,
                },
                'distance': round(medicine.distance, 2)
            })

        return Response(results)

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return Prescription.objects.none()
        if not self.request.user.is_authenticated:
            return Prescription.objects.none()
        if self.request.user.user_type == 'pharmacy':
            return Prescription.objects.filter(pharmacy=self.request.user.pharmacy_profile)
        elif self.request.user.user_type == 'patient':
            return Prescription.objects.filter(patient=self.request.user)
        return Prescription.objects.none()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return Order.objects.none()
        if not self.request.user.is_authenticated:
            return Order.objects.none()
        if self.request.user.user_type == 'pharmacy':
            return Order.objects.filter(pharmacy=self.request.user.pharmacy_profile)
        elif self.request.user.user_type == 'patient':
            return Order.objects.filter(patient=self.request.user)
        return Order.objects.none()

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        """
        Add an item to the order
        """
        order = self.get_object()
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
