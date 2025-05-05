from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PharmacyProfile, PatientProfile, MedicineInventory

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                 'user_type', 'phone_number', 'address', 'latitude', 'longitude')
        read_only_fields = ('id',)

class PharmacyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PharmacyProfile
        fields = '__all__'
        read_only_fields = ('user', 'rating', 'total_ratings')

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'
        read_only_fields = ('user',)

class MedicineInventorySerializer(serializers.ModelSerializer):
    pharmacy = UserSerializer(read_only=True)
    
    class Meta:
        model = MedicineInventory
        fields = '__all__'
        read_only_fields = ('pharmacy', 'created_at', 'updated_at')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    pharmacy_profile = PharmacyProfileSerializer(required=False)
    patient_profile = PatientProfileSerializer(required=False)
    username = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name',
                 'user_type', 'phone_number', 'address', 'latitude', 'longitude',
                 'pharmacy_profile', 'patient_profile')
    
    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
        pharmacy_data = validated_data.pop('pharmacy_profile', None)
        patient_data = validated_data.pop('patient_profile', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create profile based on user type
        if user.user_type == 'pharmacy' and pharmacy_data:
            PharmacyProfile.objects.create(user=user, **pharmacy_data)
        elif user.user_type == 'patient' and patient_data:
            PatientProfile.objects.create(user=user, **patient_data)
        
        return user 