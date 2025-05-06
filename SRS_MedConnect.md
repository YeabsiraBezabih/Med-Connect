# Software Requirements Specification (SRS)

## Project: MedConnect

---

## 1. Introduction

### 1.1 Purpose
MedConnect is a web-based platform designed to connect patients, pharmacies, and healthcare providers. The system enables users to search for medicines, register as patients or pharmacies, manage prescriptions and orders, and communicate securely. This SRS defines the requirements for the MedConnect system.

### 1.2 Scope
MedConnect aims to:
- Allow patients to search for medicines at nearby pharmacies.
- Enable pharmacies to manage inventory and respond to prescription requests.
- Provide secure registration and authentication for both user types.
- Facilitate chat and communication between patients and pharmacies.
- Ensure compliance with privacy, security, and legal standards.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **UI**: User Interface
- **ETB**: Ethiopian Birr (currency)
- **JWT**: JSON Web Token
- **Expiry Date**: The date after which a medicine is considered expired and should not be dispensed.
- **Discount**: A percentage or fixed amount reduction in the price of a medicine, set by the pharmacy.

### 1.4 References
- IEEE SRS Standard 830-1998
- MedConnect UI/UX wireframes
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)

---

## 2. Overall Description

### 2.1 Product Perspective
MedConnect is a standalone web application with a React frontend and Django backend. It integrates with third-party geolocation APIs and supports both patient and pharmacy user roles.

### 2.2 Product Functions
- User registration and authentication (patients, pharmacies)
- Medicine search (by name, location, stock, price, expiry, discount)
- Pharmacy inventory management (including expiry date and discount)
- Prescription upload and response
- Order management
- Real-time chat between users and pharmacies (WebSocket-based)
- Legal and info pages (Privacy Policy, Terms of Service, FAQ)
- Location-based features (pharmacy geolocation, search radius)
- Map view of pharmacies and routes
- Chatbot for user support

### 2.3 User Classes and Characteristics
- **Patient**: Can search for medicines, view pharmacies, upload prescriptions, place orders, and chat with pharmacies.
- **Pharmacy**: Can manage inventory, respond to prescriptions, view and manage orders, and chat with patients.
- **Admin** (future): Can manage users, pharmacies, and oversee platform compliance.

### 2.4 Operating Environment
- Web browsers (Chrome, Firefox, Edge, Safari)
- Backend: Python 3.12+, Django 5.x, PostgreSQL
- Frontend: React 18+, TypeScript
- Hosting: Cloud or on-premise

### 2.5 Design and Implementation Constraints
- Must comply with healthcare data privacy laws (e.g., GDPR, HIPAA if applicable)
- Secure authentication (JWT, HTTPS)
- Responsive and accessible UI
- Robust error handling and validation

### 2.6 User Documentation
- Online help and FAQ page
- User onboarding guides
- Contact support page

### 2.7 Assumptions and Dependencies
- Users have internet access and a modern browser
- Pharmacies provide accurate inventory and location data
- Geolocation permissions are granted by users

---

## 3. System Features and Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Registration and Authentication
- FR1: The system shall allow users to register as patients or pharmacies.
- FR2: The system shall require pharmacies to provide business details and location during registration.
- FR3: The system shall require users to accept Terms of Service and Privacy Policy.
- FR4: The system shall authenticate users using JWT tokens.

#### 3.1.2 Medicine Search
- FR5: The system shall allow patients to search for medicines by name.
- FR6: The system shall allow filtering by distance, price, stock status, expiry date, and discount.
- FR7: The system shall display pharmacy details, distance, contact options, expiry date, and discount information.

#### 3.1.3 Pharmacy Inventory Management
- FR8: The system shall allow pharmacies to add, edit, and delete medicines.
- FR9: The system shall require location to be set for each pharmacy.
- FR10: The system shall display inventory in a dashboard, including expiry date and discount for each medicine.
- FR10a: The system shall allow pharmacies to set an expiry date for each medicine.
- FR10b: The system shall allow pharmacies to set a discount (percentage or fixed) for each medicine.
- FR10c: The system shall prevent dispensing or ordering expired medicines.

#### 3.1.4 Prescription and Order Management
- FR11: The system shall allow patients to upload prescriptions.
- FR12: The system shall allow pharmacies to respond to prescription requests.
- FR13: The system shall allow patients to place orders for medicines.
- FR14: The system shall allow pharmacies to manage and update order status.

#### 3.1.5 Communication
- FR15: The system shall provide a chat feature between patients and pharmacies.
- FR16: The system shall restrict chat to authenticated users.

#### 3.1.6 Legal and Info Pages
- FR17: The system shall provide Privacy Policy, Terms of Service, and FAQ pages.
- FR18: The system shall display company info and contact details in the footer.

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- NFR1: The system shall respond to user actions within 2 seconds under normal load.
- NFR2: The system shall support at least 100 concurrent users.

#### 3.2.2 Security
- NFR3: All sensitive data shall be transmitted over HTTPS.
- NFR4: User passwords shall be hashed and never stored in plain text.
- NFR5: Only authenticated users can access protected resources.

#### 3.2.3 Usability
- NFR6: The UI shall be responsive and accessible (WCAG 2.1 AA).
- NFR7: Error messages shall be clear and actionable.

#### 3.2.4 Reliability & Availability
- NFR8: The system shall have 99% uptime excluding scheduled maintenance.
- NFR9: The system shall provide meaningful error handling and logging.

#### 3.2.5 Maintainability
- NFR10: The codebase shall follow best practices and be well-documented.
- NFR11: The system shall be modular to allow for future feature expansion.

#### 3.2.6 Portability
- NFR12: The system shall run on all major browsers and operating systems.

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive web UI for patients and pharmacies
- Dashboard for pharmacy management (with expiry and discount management)
- Search and results pages for patients (showing expiry date and discount)
- Registration and login forms
- Chat interface (real-time, WebSocket-based)
- Info/legal pages
- Map view for pharmacies and routes
- Chatbot modal for user support

### 4.2 Hardware Interfaces
- None (web-based)

### 4.3 Software Interfaces
- RESTful API (Django REST Framework)
- Geolocation API (browser)
- Email service for notifications (future)

### 4.4 Communications Interfaces
- HTTPS for all client-server communication

---

## 5. Other Requirements

- Data backup and recovery procedures
- Audit logging for sensitive actions
- Compliance with local healthcare regulations
- Scalability for future growth

---

## 6. Appendices

- A. Wireframes and UI mockups (see design folder)
- B. API documentation (see backend/docs)
- C. Glossary of terms

---

## 7. Folder Structure

### 7.1 Backend

```
backend/
  chat/
    admin.py
    apps.py
    models.py
    serializers.py
    tests.py
    urls.py
    views.py
    migrations/
  medconnect/
    __init__.py
    asgi.py
    settings.py
    urls.py
    views.py
    wsgi.py
  pharmacy/
    admin.py
    apps.py
    models.py
    serializers.py
    tests.py
    urls.py
    views.py
    migrations/
  users/
    admin.py
    apps.py
    models.py
    serializers.py
    tests.py
    urls.py
    views.py
    migrations/
  manage.py
  requirements.txt
  .env
  venv/
```

### 7.2 Frontend

```
frontend/
  src/
    components/
      auth/
      layout/
      pharmacy/
      icons.tsx
    contexts/
    hooks/
    pages/
      auth/
        Login.tsx
        Register.tsx
        PharmacyLogin.tsx
        PharmacyRegister.tsx
      info/
        FAQ.tsx
        TermsOfService.tsx
        PrivacyPolicy.tsx
      SearchPage.tsx
      PharmacyDashboard.tsx
      UserDashboard.tsx
      LandingPage.tsx
      ChatPage.tsx
      UploadPage.tsx
    services/
    utils/
    App.tsx
    main.tsx
    index.css
    vite-env.d.ts
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  postcss.config.js
  tailwind.config.js
  index.html
  node_modules/
```

---

## 8. Backend API Request/Response Format

### 8.1 Authentication & Registration

#### Register User/Pharmacy
- **POST** `/api/users/register/`
- **Request:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient", // or "pharmacy"
    "phone_number": "123456789",
    "address": "123 Main St"
    // For pharmacy: additional fields like business_name, license_number, latitude, longitude, etc.
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "patient",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "123456789",
    "address": "123 Main St",
    "pharmacy_profile": null,
    "patient_profile": {
      "id": 1,
      "date_of_birth": null,
      "medical_history": "",
      "allergies": ""
    }
  }
  ```

#### Login
- **POST** `/api/users/login/`
- **Request:**
  ```json
  {
    "username": "john_doe",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "refresh": "jwt_refresh_token",
    "access": "jwt_access_token",
    "user": { ...user object as above... }
  }
  ```

---

### 8.2 Medicines

#### List/Search Medicines
- **GET** `/api/pharmacy/medicines/`
- **Query Params:** `?search=paracetamol`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Paracetamol",
      "price": 50,
      "stock": 100,
      "requires_prescription": false,
      "pharmacy": 2
    }
  ]
  ```

#### Search Nearby Medicines
- **GET** `/api/pharmacy/medicines/search_nearby/?name=paracetamol&lat=9.03&lng=38.74&radius=10`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Paracetamol",
      "price": 50,
      "stock": 100,
      "requires_prescription": false,
      "pharmacy": {
        "id": 2,
        "name": "HealthPlus",
        "address": "123 Main St",
        "phone": "123456789",
        "latitude": 9.03,
        "longitude": 38.74
      },
      "distance": 2.5
    }
  ]
  ```

#### Add/Edit/Delete Medicine (Pharmacy only)
- **POST/PUT/DELETE** `/api/pharmacy/medicines/`
- **Request:** (POST/PUT)
  ```json
  {
    "name": "Ibuprofen",
    "price": 80,
    "stock": 50,
    "requires_prescription": true,
    "pharmacy": 2
  }
  ```
- **Response:** (POST)
  ```json
  {
    "id": 2,
    "name": "Ibuprofen",
    "price": 80,
    "stock": 50,
    "requires_prescription": true,
    "pharmacy": 2
  }
  ```

---

### 8.3 Prescriptions

#### Upload Prescription
- **POST** `/api/pharmacy/prescriptions/`
- **Request:**
  ```json
  {
    "patient": 1,
    "pharmacy": 2,
    "image": "base64 or file upload",
    "notes": "Please process quickly"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "patient": 1,
    "pharmacy": 2,
    "image": "url/to/image.jpg",
    "notes": "Please process quickly",
    "status": "pending"
  }
  ```

#### List Prescriptions
- **GET** `/api/pharmacy/prescriptions/`
- **Response:** (array of prescription objects)

---

### 8.4 Orders

#### Place Order
- **POST** `/api/pharmacy/orders/`
- **Request:**
  ```json
  {
    "patient": 1,
    "pharmacy": 2,
    "items": [
      { "medicine": 1, "quantity": 2 }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "patient": 1,
    "pharmacy": 2,
    "items": [
      { "id": 1, "medicine": 1, "quantity": 2 }
    ],
    "status": "pending"
  }
  ```

#### Update Order Status
- **PATCH** `/api/pharmacy/orders/{id}/`
- **Request:**
  ```json
  { "status": "completed" }
  ```
- **Response:** (updated order object)

---

### 8.5 Chat

#### Send Message
- **POST** `/api/chat/messages/`
- **Request:**
  ```json
  {
    "sender": 1,
    "receiver": 2,
    "message": "Hello, is Paracetamol in stock?"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "sender": 1,
    "receiver": 2,
    "message": "Hello, is Paracetamol in stock?",
    "timestamp": "2024-06-01T12:00:00Z"
  }
  ```

#### List Messages
- **GET** `/api/chat/messages/?chat_with=2`
- **Response:** (array of message objects)

---

## 9. Database Configuration

MedConnect uses PostgreSQL as its primary database for all backend data storage. The configuration is managed via environment variables and Django settings.

### 9.1 Django Database Settings

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

### 9.2 Environment Variables (backend/.env)

```
DB_NAME=medconnect
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

- `DB_NAME`: Name of the PostgreSQL database
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host (usually `localhost` for development)
- `DB_PORT`: Database port (default: 5432)

### 9.3 Dependencies

The backend requires the following Python packages for PostgreSQL integration:
- `psycopg2` or `psycopg2-binary`
- `django-environ` or `python-dotenv` (for environment variable management)

These are included in `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
python-dotenv==1.0.1
```

### 9.4 Notes
- All sensitive credentials are stored in the `.env` file and should not be committed to version control.
- The database should be initialized and migrated using Django's migration system (`python manage.py migrate`).
- For production, ensure the database is secured and not accessible from untrusted networks.

---

## 10. Entity-Relationship (ER) Diagram and Data Structures

### 10.1 ER Diagram (Textual)

```
+-------------------+        1         1 +---------------------+
|       User        |<------------------>|  PatientProfile     |
+-------------------+                   +---------------------+
| id (PK)           |                   | id (PK)             |
| username          |                   | user_id (FK)        |
| email             |                   | date_of_birth       |
| password          |                   | medical_history     |
| user_type         |                   | allergies           |
| phone_number      |                   +---------------------+
| address           |
+-------------------+
        | 1
        |
        | 1
        v
+---------------------+
|  PharmacyProfile    |
+---------------------+
| id (PK)             |
| user_id (FK)        |
| license_number      |
| business_name       |
| operating_hours     |
| is_verified         |
| latitude            |
| longitude           |
+---------------------+
        |
        | 1
        |<-------------------+
        |                    |
        v                    |
+-------------------+        |
|    Medicine       |        |
+-------------------+        |
| id (PK)           |        |
| name              |        |
| description       |        |
| price             |        |
| stock             |        |
| pharmacy_id (FK)  |--------+
| requires_presc.   |
| created_at        |
| updated_at        |
+-------------------+
        |
        | 1
        |<-------------------+
        |                    |
        v                    |
+-------------------+        |
|  Prescription     |        |
+-------------------+        |
| id (PK)           |        |
| patient_id (FK)   |        |
| medicine_id (FK)  |        |
| pharmacy_id (FK)  |--------+
| prescription_img  |
| status            |
| notes             |
| created_at        |
| updated_at        |
+-------------------+
        |
        | 0..1
        v
+-------------------+
|     Order         |
+-------------------+
| id (PK)           |
| patient_id (FK)   |
| pharmacy_id (FK)  |
| prescription_id   |
| status            |
| total_amount      |
| shipping_address  |
| created_at        |
| updated_at        |
+-------------------+
        |
        | 1
        v
+-------------------+
|   OrderItem       |
+-------------------+
| id (PK)           |
| order_id (FK)     |
| medicine_id (FK)  |
| quantity          |
| price             |
+-------------------+

+-------------------+        +-------------------+
|    ChatRoom       |<------>|      User         |
+-------------------+  M:N   +-------------------+
| id (PK)           |
| created_at        |
| updated_at        |
+-------------------+
        |
        | 1
        v
+-------------------+
|    Message        |
+-------------------+
| id (PK)           |
| chat_room_id (FK) |
| sender_id (FK)    |
| content           |
| created_at        |
| is_read           |
+-------------------+
```

### 10.2 Data Structures (Model Summaries)

#### User
- id, username, email, password, user_type (patient/pharmacy), phone_number, address

#### PatientProfile
- id, user (OneToOne), date_of_birth, medical_history, allergies

#### PharmacyProfile
- id, user (OneToOne), license_number, business_name, operating_hours, is_verified, latitude, longitude

#### Medicine
- id, name, description, price, stock, pharmacy (ForeignKey), requires_prescription, created_at, updated_at

#### Prescription
- id, patient (ForeignKey), medicine (ForeignKey), pharmacy (ForeignKey), prescription_image, status, notes, created_at, updated_at

#### Order
- id, patient (ForeignKey), pharmacy (ForeignKey), prescription (ForeignKey, nullable), status, total_amount, shipping_address, created_at, updated_at

#### OrderItem
- id, order (ForeignKey), medicine (ForeignKey), quantity, price

#### ChatRoom
- id, participants (ManyToMany to User), created_at, updated_at

#### Message
- id, chat_room (ForeignKey), sender (ForeignKey to User), content, created_at, is_read

---

*End of SRS Document* 