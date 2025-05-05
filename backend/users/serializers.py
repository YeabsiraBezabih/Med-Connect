from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import PatientProfile, PharmacyProfile, SearchHistory
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class PharmacyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacyProfile
        fields = ('id', 'license_number', 'business_name', 'operating_hours', 'is_verified', 'latitude', 'longitude')

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ('id', 'date_of_birth', 'medical_history', 'allergies')

class UserSerializer(serializers.ModelSerializer):
    pharmacy_profile = PharmacyProfileSerializer(read_only=True)
    patient_profile = PatientProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    user_type = serializers.ChoiceField(choices=['patient', 'pharmacy'], required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    address = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'user_type',
            'phone_number', 'address', 'pharmacy_profile', 'patient_profile'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'user_type': {'required': True},
            'phone_number': {'required': True},
            'address': {'required': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, data):
        if data.get('user_type') not in ['patient', 'pharmacy']:
            raise serializers.ValidationError({"user_type": "User type must be either 'patient' or 'pharmacy'."})
        return data

    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'date']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = None

        # Try to authenticate with username
        user = authenticate(username=username, password=password)
        if not user:
            # Try to authenticate with email
            from users.models import User
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('No active account found with the given credentials')

        data = super().validate({'username': user.username, 'password': password})
        return data 