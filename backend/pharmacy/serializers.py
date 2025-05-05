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
    prescription_image = serializers.URLField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    medicine = serializers.PrimaryKeyRelatedField(queryset=Medicine.objects.all(), required=False, allow_null=True)
    pharmacy = serializers.PrimaryKeyRelatedField(queryset=PharmacyProfile.objects.all(), required=False, allow_null=True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Prescription
        fields = '__all__'

    def create(self, validated_data):
        print('DEBUG: context:', self.context)
        print('DEBUG: validated_data before:', validated_data)
        if 'patient' not in validated_data:
            validated_data['patient'] = self.context['request'].user
        print('DEBUG: validated_data after:', validated_data)
        return super().create(validated_data)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__' 