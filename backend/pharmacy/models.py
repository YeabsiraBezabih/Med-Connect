from django.db import models
from django.core.validators import MinValueValidator
from users.models import User, PharmacyProfile

class Medicine(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    pharmacy = models.ForeignKey(PharmacyProfile, on_delete=models.CASCADE, related_name='medicines')
    requires_prescription = models.BooleanField(default=True)
    expire_date = models.DateField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0, 
        validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return f"{self.name} - {self.pharmacy.business_name}"

class Prescription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('filled', 'Filled'),
    )

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, null=True, blank=True)
    pharmacy = models.ForeignKey(PharmacyProfile, on_delete=models.CASCADE, null=True, blank=True)
    prescription_image = models.URLField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.email} - {self.medicine.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    pharmacy = models.ForeignKey(PharmacyProfile, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.patient.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.medicine.name} x {self.quantity}"
