from rest_framework import serializers
from .models import PrescriptionBroadcast, PharmacyResponse
from apps.users.serializers import UserSerializer

class PrescriptionBroadcastSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    responses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PrescriptionBroadcast
        fields = '__all__'
        read_only_fields = ('patient', 'status')
    
    def get_responses_count(self, obj):
        return obj.responses.count()

class PharmacyResponseSerializer(serializers.ModelSerializer):
    pharmacy = UserSerializer(read_only=True)
    broadcast = PrescriptionBroadcastSerializer(read_only=True)
    
    class Meta:
        model = PharmacyResponse
        fields = '__all__'
        read_only_fields = ('pharmacy', 'broadcast')

class BroadcastCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionBroadcast
        fields = ('medication_name', 'dosage', 'frequency', 'duration', 
                 'notes', 'prescription_image', 'expiry_date')
    
    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)

class ResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyResponse
        fields = ('status', 'price', 'estimated_delivery_time', 'notes')
    
    def create(self, validated_data):
        broadcast_id = self.context['broadcast_id']
        validated_data['broadcast_id'] = broadcast_id
        validated_data['pharmacy'] = self.context['request'].user
        return super().create(validated_data) 