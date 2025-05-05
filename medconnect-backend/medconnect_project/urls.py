from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

schema_view = get_schema_view(
    openapi.Info(
        title="MedConnect API",
        default_version='v1',
        description="""
        API documentation for MedConnect - A platform connecting patients with pharmacies.
        
        ## Authentication
        This API uses JWT authentication. To authenticate:
        1. Use the `/api/users/token/` endpoint to get your access and refresh tokens
        2. Include the access token in the Authorization header: `Bearer <access_token>`
        
        ## User Types
        - Patients: Can create prescription broadcasts and manage their profile
        - Pharmacies: Can respond to broadcasts and manage their inventory
        
        ## Endpoints
        - Users: Manage user accounts and authentication
        - Broadcasts: Handle prescription broadcasts and pharmacy responses
        - Chat: Real-time communication between patients and pharmacies
        """,
        terms_of_service="https://www.medconnect.com/terms/",
        contact=openapi.Contact(email="support@medconnect.com"),
        license=openapi.License(name="Proprietary License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=[
        path('api/users/', include('apps.users.urls')),
        path('api/broadcasts/', include('apps.broadcasts.urls')),
        path('api/chat/', include('apps.chat.urls')),
    ],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/broadcasts/', include('apps.broadcasts.urls')),
    path('api/chat/', include('apps.chat.urls')),
    
    # API documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 