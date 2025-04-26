from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PharmacyProfile, PatientProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', 'user_type')}),
        ('Contact info', {'fields': ('phone_number', 'address', 'latitude', 'longitude')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'user_type'),
        }),
    )

@admin.register(PharmacyProfile)
class PharmacyProfileAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'license_number', 'user', 'is_verified', 'rating')
    list_filter = ('is_verified',)
    search_fields = ('business_name', 'license_number', 'user__email')
    readonly_fields = ('rating', 'total_ratings')

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_of_birth', 'emergency_contact')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    list_filter = ('date_of_birth',) 