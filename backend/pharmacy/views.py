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
        if getattr(self, 'swagger_fake_view', False):
            return Medicine.objects.none()
        # Only restrict to pharmacy's own medicines for authenticated pharmacy users
        if self.request.user.is_authenticated and getattr(self.request.user, 'user_type', None) == 'pharmacy':
            return Medicine.objects.filter(pharmacy=self.request.user.pharmacy_profile)
        # For all other users (including authenticated patients and unauthenticated users), return all medicines
        return Medicine.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and self.request.user.user_type == 'pharmacy':
            serializer.save(pharmacy=self.request.user.pharmacy_profile)
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def search_nearby(self, request):
        """
        Search for medicines near a specific location
        """
        name = request.query_params.get('name', '')
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = float(request.query_params.get('radius', 10.0))  # Default 10km radius
        sort = request.query_params.get('sort', 'distance')  # New: sort param
        
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
        ).select_related('pharmacy')

        # Sort by distance or price
        if sort == 'price':
            queryset = queryset.order_by('price')
        else:
            queryset = queryset.order_by('distance')

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
                    'address': medicine.pharmacy.user.address,
                    'phone': medicine.pharmacy.user.phone_number,
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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):  # handle Swagger schema generation
            return Prescription.objects.none()
        if not self.request.user.is_authenticated:
            return Prescription.objects.none()
        if self.request.user.user_type == 'pharmacy':
            # Show all pending prescriptions that are not yet assigned to a pharmacy
            return Prescription.objects.filter(status='pending', pharmacy__isnull=True)
        elif self.request.user.user_type == 'patient':
            return Prescription.objects.filter(patient=self.request.user)
        return Prescription.objects.none()

    def perform_create(self, serializer):
        latitude = self.request.data.get('latitude')
        longitude = self.request.data.get('longitude')
        instance = serializer.save(patient=self.request.user, latitude=latitude, longitude=longitude)
        from users.models import PharmacyProfile
        nearest_pharmacy = None
        if latitude and longitude:
            from django.db.models import F, FloatField
            from django.db.models.functions import ACos, Cos, Radians, Sin
            lat = float(latitude)
            lng = float(longitude)
            distance_formula = (
                6371.0 * ACos(
                    Cos(Radians(lat, output_field=FloatField())) * 
                    Cos(Radians(F('latitude'), output_field=FloatField())) * 
                    Cos(Radians(F('longitude'), output_field=FloatField()) - Radians(lng, output_field=FloatField())) + 
                    Sin(Radians(lat, output_field=FloatField())) * Sin(Radians(F('latitude'), output_field=FloatField())),
                    output_field=FloatField()
                )
            )
            nearby_pharmacies = PharmacyProfile.objects.annotate(
                distance=distance_formula
            ).filter(distance__lte=10).order_by('distance')
            for pharmacy in nearby_pharmacies:
                print(f"Notify pharmacy {pharmacy.business_name} (ID: {pharmacy.id}) about new prescription {instance.id}")
            if nearby_pharmacies.exists():
                nearest_pharmacy = nearby_pharmacies.first()
        if not nearest_pharmacy:
            nearest_pharmacy = PharmacyProfile.objects.first()
        if nearest_pharmacy:
            from decimal import Decimal
            Order.objects.create(
                patient=self.request.user,
                pharmacy=nearest_pharmacy,
                prescription=instance,
                status='pending',
                total_amount=Decimal('0.00'),
                shipping_address=getattr(self.request.user, 'address', '') or 'N/A',
            )
        else:
            print(f"No pharmacy found to create order for prescription {instance.id}")

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        """
        Pharmacy accepts a prescription: assign it to this pharmacy and update status to 'accepted'.
        Also, create a chat room between the pharmacy and the patient if it doesn't exist.
        Returns the chat room ID and URL in the response.
        """
        if request.user.user_type != 'pharmacy':
            return Response({'detail': 'Only pharmacies can accept prescriptions.'}, status=status.HTTP_403_FORBIDDEN)
        prescription = self.get_object()
        if prescription.pharmacy is not None:
            return Response({'detail': 'Prescription already assigned to a pharmacy.'}, status=status.HTTP_400_BAD_REQUEST)
        prescription.pharmacy = request.user.pharmacy_profile
        prescription.status = 'accepted'
        prescription.save()
        # Create chat room if not exists
        from chat.models import ChatRoom
        patient = prescription.patient
        pharmacy_user = request.user
        chat_room = ChatRoom.objects.filter(participants=patient).filter(participants=pharmacy_user).first()
        if not chat_room:
            chat_room = ChatRoom.objects.create()
            chat_room.participants.add(patient, pharmacy_user)
        data = self.get_serializer(prescription).data
        data['chat_room_id'] = chat_room.id
        data['chat_room_url'] = f"/api/chat/rooms/{chat_room.id}/"  # Add chat room API URL
        return Response(data)

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
