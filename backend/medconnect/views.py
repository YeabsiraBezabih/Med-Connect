from django.views.generic import TemplateView
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Root endpoint that provides links to all available API endpoints
    """
    return Response({
        'title': 'MedConnect API',
        'version': 'v1.0',
        'description': 'Welcome to the MedConnect API - Connecting Patients with Pharmacies',
        'documentation': {
            'swagger': request.build_absolute_uri(reverse('schema-swagger-ui')),
            'redoc': request.build_absolute_uri(reverse('schema-redoc')),
        },
        'endpoints': {
            'users': request.build_absolute_uri('/api/users/'),
            'pharmacy': request.build_absolute_uri('/api/pharmacy/'),
            'chat': request.build_absolute_uri('/api/chat/'),
        },
        'authentication': {
            'obtain_token': request.build_absolute_uri('/api/users/token/'),
            'refresh_token': request.build_absolute_uri('/api/users/token/refresh/'),
            'register': request.build_absolute_uri('/api/users/users/register/'),
        }
    }) 