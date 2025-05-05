from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('patient', 'Patient'),
        ('pharmacy', 'Pharmacy'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    
    def __str__(self):
        return self.email

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.email}'s Profile"

class PharmacyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='pharmacy_profile')
    license_number = models.CharField(max_length=50)
    business_name = models.CharField(max_length=100)
    operating_hours = models.TextField()
    is_verified = models.BooleanField(default=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    
    def __str__(self):
        return self.business_name

class SearchHistory(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='search_histories')
    query = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.query} ({self.date})"
