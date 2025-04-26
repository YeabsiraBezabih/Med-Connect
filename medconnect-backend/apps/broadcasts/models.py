from django.db import models
from django.conf import settings

class PrescriptionBroadcast(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='broadcasts')
    medication_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    prescription_image = models.ImageField(upload_to='prescriptions/', blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expiry_date = models.DateTimeField()
    
    def __str__(self):
        return f"{self.medication_name} - {self.patient.email}"

class PharmacyResponse(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    
    broadcast = models.ForeignKey(PrescriptionBroadcast, on_delete=models.CASCADE, related_name='responses')
    pharmacy = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='broadcast_responses')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_delivery_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('broadcast', 'pharmacy')
    
    def __str__(self):
        return f"{self.broadcast.medication_name} - {self.pharmacy.email}" 