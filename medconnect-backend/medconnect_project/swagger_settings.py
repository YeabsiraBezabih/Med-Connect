from drf_yasg import openapi

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'DEFAULT_MODEL_RENDERING': 'example',
    'DEFAULT_MODEL_DEPTH': 2,
    'DEFAULT_INFO': openapi.Info(
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
    'OPERATIONS_SORTER': 'alpha',
    'TAGS_SORTER': 'alpha',
    'DOC_EXPANSION': 'list',
    'DEEP_LINKING': True,
    'PERSIST_AUTHORIZATION': True,
    'REFETCH_SCHEMA_WITH_AUTH': True,
    'REFETCH_SCHEMA_ON_LOGOUT': True,
    'VALIDATOR_URL': None,
    'DEFAULT_PAGINATOR_INSPECTORS': [
        'drf_yasg.inspectors.CoreAPICompatInspector',
    ],
    'DEFAULT_FIELD_INSPECTORS': [
        'drf_yasg.inspectors.CamelCaseJSONFilter',
        'drf_yasg.inspectors.ReferencingSerializerInspector',
        'drf_yasg.inspectors.RelatedFieldInspector',
        'drf_yasg.inspectors.ChoiceFieldInspector',
        'drf_yasg.inspectors.FileFieldInspector',
        'drf_yasg.inspectors.DictFieldInspector',
        'drf_yasg.inspectors.SimpleFieldInspector',
        'drf_yasg.inspectors.StringDefaultFieldInspector',
    ],
} 