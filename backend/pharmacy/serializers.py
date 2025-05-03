from rest_framework import serializers
from .models import Medicine, Prescription, Order, OrderItem
from users.models import PharmacyProfile

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
        
    def validate(self, data):
        # Validate pharmacy
        pharmacy_id = data.get('pharmacy')
        if pharmacy_id:
            try:
                if isinstance(pharmacy_id, (int, str)):
                    PharmacyProfile.objects.get(id=pharmacy_id)
            except PharmacyProfile.DoesNotExist:
                raise serializers.ValidationError({
                    'pharmacy': 'Invalid pharmacy ID. Please check your credentials.'
                })
        
        # Validate price and stock
        if data.get('price', 0) < 0:
            raise serializers.ValidationError({
                'price': 'Price cannot be negative.'
            })
            
        if data.get('stock', 0) < 0:
            raise serializers.ValidationError({
                'stock': 'Stock cannot be negative.'
            })
            
        return data

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__' 