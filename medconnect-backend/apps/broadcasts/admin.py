from django.contrib import admin
from .models import PrescriptionBroadcast, PharmacyResponse

@admin.register(PrescriptionBroadcast)
class PrescriptionBroadcastAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'patient', 'status', 'created_at', 'expiry_date')
    list_filter = ('status', 'created_at', 'expiry_date')
    search_fields = ('medication_name', 'patient__email', 'notes')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'

@admin.register(PharmacyResponse)
class PharmacyResponseAdmin(admin.ModelAdmin):
    list_display = ('broadcast', 'pharmacy', 'status', 'price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('broadcast__medication_name', 'pharmacy__email', 'notes')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at' 