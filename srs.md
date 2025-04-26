

**Software Requirements Specification (SRS)**

**Project: MedConnect - MVP (Broadcast Model)**

**Version: 1.1**

**Date: April 25, 2024**



**Prepared By: AfriSolvers (Team 9)**

---

**1. Introduction**

**1.1 Purpose**

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the Minimum Viable Product (MVP) of MedConnect, implementing a location-based broadcast model. MedConnect is a mobile-friendly web application designed as a digital bridge connecting patients needing prescriptions with nearby pharmacies, developed by Team AfriSolvers. This document serves as the primary guide for design, development, testing, and stakeholder understanding of the MVP.

**1.2 Scope**

The scope of this SRS is strictly limited to the Minimum Viable Product (MVP) of the MedConnect application, implementing a location-based broadcast model for prescription fulfillment requests.

**The MedConnect MVP *will* include:**

*   Basic user registration and login for Patients and Pharmacies.
*   Pharmacy registration including capturing precise location (latitude/longitude).
*   Functionality for Patients to upload prescription documents (images or PDFs) and have their current location captured.
*   Backend functionality to identify registered pharmacies within a defined radius (e.g., 1km) of the patient's location.
*   Broadcasting the uploaded prescription details to all identified nearby pharmacies.
*   A distinct dashboard interface for Pharmacies to view incoming prescription requests broadcasted to them.
*   Functionality for Pharmacies to view the uploaded document and respond with their availability status ("Available", "Not Available").
*   Functionality for Patients to view a list of pharmacies that responded "Available".
*   Functionality for Patients to select/confirm their chosen pharmacy from the available list.
*   A basic chat feature allowing a Patient to communicate with the chosen Pharmacy regarding the specific prescription broadcast.
*   Display of prescription broadcast history and status for Patients. Display of response history for Pharmacies.

**The MedConnect MVP *will NOT* include:**

*   Optical Character Recognition (OCR) for prescription parsing.
*   AI-driven features (medication alternatives, interaction checks).
*   Real-time, automated inventory synchronization with pharmacy systems.
*   Advanced analytics or reporting features.
*   Advanced mapping interfaces or routing.
*   Push notifications.
*   Integration with Healthcare Provider systems (EHRs).
*   Payment processing or financial transactions.
*   Complex status management beyond the core broadcast/response/choice flow.

**1.3 Definitions, Acronyms, and Abbreviations**

| Term                 | Definition                                                                                        |
| :------------------- | :------------------------------------------------------------------------------------------------ |
| API                  | Application Programming Interface                                                                 |
| Broadcast            | See Prescription Broadcast.                                                                       |
| CRUD                 | Create, Read, Update, Delete                                                                      |
| DB                   | Database                                                                                          |
| EHR                  | Electronic Health Record                                                                          |
| FR                   | Functional Requirement                                                                            |
| GUI                  | Graphical User Interface                                                                          |
| GeoDjango            | A module included with Django that enables geospatial operations with a geographic database.      |
| Geolocation          | Identifying the real-world geographic location of an object, such as a mobile device or computer. |
| GiST                 | Generalized Search Tree; a type of index used in PostgreSQL for spatial data efficiency.          |
| HTTP(S)              | HyperText Transfer Protocol (Secure)                                                              |
| JWT                  | JSON Web Token                                                                                    |
| Lat/Lon              | Latitude / Longitude coordinates.                                                                 |
| MVP                  | Minimum Viable Product                                                                            |
| NFR                  | Non-Functional Requirement                                                                        |
| OCR                  | Optical Character Recognition                                                                     |
| Patient              | An end-user seeking to fulfill a medication prescription via the platform.                        |
| Pharmacy             | An end-user (representing a pharmacy business) using the platform to receive and manage requests. |
| Pharmacy Response    | The record representing a specific pharmacy's reply (Available/Not Available) to a Broadcast.     |
| PostGIS              | A spatial database extender for PostgreSQL object-relational database. Adds support for geographic objects. |
| Prescription Broadcast | The digital submission created when a Patient uploads a prescription, triggering distribution to nearby pharmacies. |
| React                | A JavaScript library for building user interfaces.                                                |
| REST                 | Representational State Transfer                                                                   |
| SRS                  | Software Requirements Specification                                                               |
| UI / UX              | User Interface / User Experience                                                                  |
| User                 | An individual registered to use MedConnect, either as a Patient or Pharmacy representative.        |

**1.4 References**

1.  AfriSolvers Team 9 Hackathon Project Idea Submission Document (April 2024)
2.  AfriSolvers Team 9 User Clarifications on Workflow (April 2024)
3.  IEEE Std 830-1998 - IEEE Recommended Practice for Software Requirements Specifications (Structural Influence)

**1.5 Document Overview**

This document outlines the MedConnect MVP requirements. Section 2 provides an overall description. Section 3 details specific functional, interface, non-functional, and data requirements. Sections follow covering proposed folder structure, design aesthetic, technology stack, appendices (placeholders), glossary, and revision history.

**2. Overall Description**

**2.1 Product Perspective**

MedConnect MVP is a standalone, responsive web application accessible via standard browsers. It facilitates a novel workflow where patient prescription uploads are broadcasted based on location to nearby registered pharmacies, who can then respond with availability, allowing the patient to choose their preferred fulfillment point. It utilizes a React frontend and a Django/PostGIS backend communicating via a RESTful API. While designed for future expansion, the MVP focuses solely on the core broadcast-response-choice workflow.

**2.2 Product Functions (MVP Summary)**

1.  **User Management:** Patient and Pharmacy registration (including Pharmacy location) and login.
2.  **Prescription Broadcast:** Patient uploads prescription; system captures location and broadcasts to nearby (1km) pharmacies.
3.  **Pharmacy Response:** Pharmacies view broadcasts, inspect documents, and respond regarding availability.
4.  **Patient Choice:** Patients view available pharmacies and select one.
5.  **Status Tracking:** Both user types can track the status of broadcasts and responses.
6.  **Post-Choice Communication:** Basic chat between Patient and their chosen Pharmacy for the specific broadcast.

**2.3 User Characteristics**

1.  **Patients:** Individuals with prescriptions, basic web literacy, access to a device with a browser and location services. Seek convenience and clarity.
2.  **Pharmacies:** Licensed pharmacies/staff with basic computer skills. Require accurate location registration. Need an efficient way to receive and respond to digital requests.

**2.4 Constraints**

*   **Technology Stack:** Development restricted to the specified stack (React, Django, PostgreSQL/PostGIS, etc.).
*   **Hosting:** Vercel (Frontend), Render (Backend).
*   **Timeline:** Hackathon schedule dictates focus on core MVP features.
*   **Team:** Development by AfriSolvers (Team 9).
*   **MVP Scope:** Functionality strictly limited as defined in Section 1.2.
*   **Connectivity & Location:** Requires stable internet and functioning browser Geolocation services.
*   **Pharmacy Density:** Demo effectiveness relies on registered pharmacies near test patient locations.
*   **Security:** Basic security practices mandated; comprehensive compliance is outside MVP scope.
*   **Browser Compatibility:** Must support latest versions of major browsers.

**2.5 Assumptions and Dependencies**

*   **User Access:** Users have necessary devices, browsers, and internet.
*   **Pharmacy Participation & Location:** Pharmacies register willingly with *accurate* latitude/longitude.
*   **Patient Location Permission:** Patients grant browser location permissions when prompted.
*   **Manual Stock Check:** Pharmacies manually verify stock before responding "Available".
*   **Prescription Legibility:** Uploaded documents are visually clear enough for pharmacist verification.
*   **Legal/Regulatory:** Assumes the broadcast model is acceptable for prototype/demo purposes in the target context.
*   **Development Environment:** Team members possess necessary tools and environments.
*   **Geospatial Capability:** PostgreSQL with PostGIS is correctly configured and utilized for efficient radius queries.

**3. Specific Requirements**

**3.1 Functional Requirements**

**3.1.1 User Authentication Module (AUTH)**

*   **FR-AUTH-001: Patient Registration**
    *   Description: Allow new user registration as a Patient.
    *   Inputs: First Name, Last Name, Email Address, Password, Password Confirmation.
    *   Processing: Validate inputs, check email uniqueness, hash password, create 'Patient' user record.
    *   Outputs: Confirmation or Error message. Optional auto-login.
*   **FR-AUTH-002: Pharmacy Registration**
    *   Description: Allow pharmacy representative registration including location.
    *   Inputs: Pharmacy Name, Email, Password, Confirmation, Address (Street, City), Latitude (Decimal), Longitude (Decimal).
    *   Processing: Validate inputs (incl. Lat/Lon format), check email uniqueness, hash password, create 'Pharmacy' user record, create associated `PharmacyProfile` with address and Lat/Lon coordinates (store as Point geometry).
    *   Outputs: Confirmation or Error message. Optional auto-login.
*   **FR-AUTH-003: User Login**
    *   Description: Allow registered Patients and Pharmacies to log in.
    *   Inputs: Email Address, Password.
    *   Processing: Validate credentials, verify password hash, establish session (e.g., JWT), redirect to appropriate dashboard.
    *   Outputs: Session initiated, Redirect. Error message on failure.
*   **FR-AUTH-004: User Logout**
    *   Description: Allow logged-in users to terminate their session.
    *   Inputs: User clicks logout action.
    *   Processing: Invalidate user session/token.
    *   Outputs: User redirected to login or public home page.

**3.1.2 Patient Module (PAT)**

*   **FR-PAT-001: Upload Prescription & Initiate Broadcast**
    *   Description: Patient uploads prescription; system captures location and broadcasts to nearby pharmacies.
    *   Inputs: Prescription file (Image/PDF), Optional note. Implicit: Patient's current location (via Browser Geolocation API).
    *   Processing: Obtain patient Lat/Lon via Geolocation API (handle errors). Validate/upload file. Create `PrescriptionBroadcast` record (Patient, file, note, location, status 'Broadcasting'). Query nearby (1km) pharmacies using geospatial query. For each found pharmacy, create linked `PharmacyResponse` record (status 'Pending'). Update broadcast status.
    *   Outputs: Confirmation ("Broadcasted to N pharmacies") or Error. Broadcast appears in Patient history.
*   **FR-PAT-002: View Broadcast Status & Pharmacy Responses**
    *   Description: Patient views broadcast status and pharmacy responses.
    *   Inputs: Patient selects a broadcast from history.
    *   Processing: Retrieve broadcast record and associated `PharmacyResponse` records.
    *   Outputs: Display overall status, file view, list of pharmacies contacted showing Name, Response Status ('Pending', 'Available', 'Not Available'), Pharmacy Note. Highlight 'Available' responses.
*   **FR-PAT-003: Choose Final Pharmacy**
    *   Description: Patient selects one pharmacy from those responding 'Available'.
    *   Inputs: Patient clicks "Choose" button next to an 'Available' pharmacy.
    *   Processing: Verify selected pharmacy status. Update `PrescriptionBroadcast` record (set `ChosenPharmacyUserID`, update `OverallStatus` to 'Completed'). Update chosen `PharmacyResponse` status to 'Chosen'. Enable chat interface for this broadcast.
    *   Outputs: Confirmation. Chat enabled. Request marked as finalized.
*   **FR-PAT-004: Access Chat with Chosen Pharmacy**
    *   Description: Patient accesses chat after choosing a pharmacy for a broadcast.
    *   Inputs: Patient clicks "Chat" on a completed broadcast.
    *   Precondition: `ChosenPharmacyUserID` is set.
    *   Processing: Load chat interface linked to `PrescriptionBroadcast` ID, routing messages between patient and chosen pharmacy.
    *   Outputs: Display chat history and input field.

**3.1.3 Pharmacy Module (PHA)**

*   **FR-PHA-001: View Incoming Broadcast Responses Queue**
    *   Description: Pharmacy views broadcast requests requiring their response.
    *   Inputs: Pharmacy user accesses their dashboard/incoming queue.
    *   Processing: Retrieve `PharmacyResponse` records for logged-in pharmacy with status 'Pending'. Fetch related broadcast data (file ref, note).
    *   Outputs: List/queue of requests needing response (Submission Time, Patient Note, Link to Details). Consider patient anonymity (e.g., Broadcast ID).
*   **FR-PHA-002: View Request Details & Document (for Response)**
    *   Description: Pharmacy views details of a pending response request.
    *   Inputs: Pharmacy selects a request from the pending queue.
    *   Processing: Retrieve response and parent broadcast data. Provide secure file view access.
    *   Outputs: Display details (Time, Note, Link to prescription file). Display response buttons ('Available', 'Not Available').
*   **FR-PHA-003: Respond with Availability**
    *   Description: Pharmacy submits their availability status for a broadcast.
    *   Inputs: Pharmacy selects 'Available' or 'Not Available'. Optional note.
    *   Processing: Update the specific `PharmacyResponse` record (status, timestamp, note). Request moves from 'Pending' queue.
    *   Outputs: Confirmation. Status updated on Patient view.
*   **FR-PHA-004: View Chosen Requests & Access Chat**
    *   Description: Pharmacy views requests where they were chosen and accesses chat.
    *   Inputs: Pharmacy navigates to "Chosen Orders" or accesses a request where their status is 'Chosen'.
    *   Processing: Retrieve relevant `PharmacyResponse` records. Allow access to broadcast details and associated Chat.
    *   Outputs: List of confirmed requests. Access to chat interface.

**3.1.4 Chat Module (CHAT)**

*   **FR-CHAT-001: Send Chat Message (Post-Choice)**
    *   Description: Allow Patient and chosen Pharmacy to exchange messages for a specific broadcast.
    *   Inputs: User types message in chat panel of a completed broadcast.
    *   Processing: Create `ChatMessage` record (linking BroadcastID, Sender, Receiver). Update interface (polling/basic WebSockets).
    *   Outputs: Message appears in chat history for both parties.
*   **FR-CHAT-002: View Chat History (Post-Choice)**
    *   Description: Display chat history for a broadcast between patient and chosen pharmacy.
    *   Inputs: User accesses chat for a completed broadcast.
    *   Processing: Retrieve relevant `ChatMessage` records. Order chronologically.
    *   Outputs: Display messages with sender/timestamp.
*   **FR-CHAT-003: New Message Indicator**
    *   Description: Provide visual cue for unread messages on completed broadcasts.
    *   Inputs: New message received for a broadcast involving the logged-in user (post-choice).
    *   Processing: Flag relevant broadcast/chat icon.
    *   Outputs: Visual cue (badge, bold text) indicating unread messages.

**3.2 Interface Requirements**

**3.2.1 User Interfaces (UI)**

*   **UI-001: Responsive Design:** Web application must be usable across desktop, tablet, and mobile screen sizes.
*   **UI-002: Branding and Style:** Adhere to the defined Design Aesthetic (See Section 5). Ensure consistency.
*   **UI-003: Key Screens:**
    *   Login Page
    *   Patient Registration Page
    *   Pharmacy Registration Page (incl. Lat/Lon input)
    *   Patient Dashboard (Broadcast List, Upload button)
    *   Pharmacy Dashboard (Pending Response Queue, possibly other views)
    *   Prescription Upload View (Patient - File input, Note, Implicit Location)
    *   Broadcast Detail View (Patient - Status, File, Pharmacy Responses, Choose button, Chat panel)
    *   Response Detail View (Pharmacy - File, Note, Respond buttons, Chat panel)
*   **UI-004: Navigation:** Intuitive navigation between key screens/features.
*   **UI-005: Feedback:** Clear visual feedback for actions (loading, success, error, location capture).

**3.2.2 Software Interfaces**

*   **SI-001: Frontend-Backend API:** React frontend communicates with Django backend via a RESTful API using JSON over HTTPS. Endpoints requiring authentication protected (JWT).
*   **SI-002: Database Interface:** Django backend interfaces with PostgreSQL/PostGIS via Django ORM and GeoDjango. Direct DB access from frontend is prohibited.
*   **SI-003: External APIs:**
    *   **Browser Geolocation API:** Required dependency for capturing patient location. Frontend integration.
    *   *(Future Scope: Google Maps API, OCR Services, AI Engines)*

**3.2.3 Hardware Interfaces**

*   **HI-001: Web Browsers:** Compatible with latest stable versions of Chrome, Firefox, Safari, Edge on standard OS.
*   **HI-002: File System/Camera:** Interfaces with device file system via standard browser file input.
*   **HI-003: Location Services:** Requires device GPS/Location services accessible via Browser Geolocation API.

**3.2.4 Communication Interfaces**

*   **CI-001: HTTPS:** All client-server communication must be encrypted using HTTPS.
*   **CI-002: REST API Protocol:** API communication uses standard HTTP methods (GET, POST, PUT, DELETE etc.).

**3.3 Non-Functional Requirements**

**3.3.1 Performance Requirements**

*   **NFR-PERF-001: Response Time:** Core UI interactions and API calls should be responsive (< 3s page load, < 1s typical API response). Geospatial queries (find nearby pharmacies) must be efficient (< 2s), requiring proper database indexing (GiST index on location).
*   **NFR-PERF-002: Upload Speed:** Prescription uploads should complete reasonably fast (< 30s for 5MB file), with progress feedback if feasible.

**3.3.2 Security Requirements**

*   **NFR-SEC-001: Secure Authentication:** Passwords securely hashed (e.g., Django defaults). No plain text storage.
*   **NFR-SEC-002: Secure Transmission:** Enforce HTTPS for all traffic.
*   **NFR-SEC-003: Session Management:** Secure session handling (e.g., secure JWT practices). Proper logout invalidation.
*   **NFR-SEC-004: Authorization:** Strict role-based access control. Patients access only their data; Pharmacies access broadcasts sent to them and related data. Backend API authorization enforced.
*   **NFR-SEC-005: Input Validation:** Robust validation on frontend (basic) and backend (primary) for all user inputs to prevent XSS, injection, etc.
*   **NFR-SEC-006: File Upload Security:** Validate file types/sizes. Store uploads securely (e.g., non-web-accessible path). Basic checks against malicious uploads.
*   **NFR-SEC-007: Location Data Privacy:** Use patient location only for the radius query. Decide on long-term storage policy (MVP assumes storage with broadcast record). Control access to pharmacy location data. Consider patient anonymity in initial broadcast views for pharmacies.

**3.3.3 Reliability Requirements**

*   **NFR-REL-001: Availability:** Core MVP features should be consistently available during demo periods on Vercel/Render.
*   **NFR-REL-002: Error Handling:** Graceful handling of common errors (network, invalid input, API failures, Geolocation failures) with user-friendly messages. Minimize uncaught exceptions.
*   **NFR-REL-003: Data Integrity:** Use database constraints (foreign keys, unique constraints). Employ transactions for multi-step operations. Validate data before saving.

**3.3.4 Usability Requirements**

*   **NFR-USA-001: Learnability:** Interface should be intuitive for users with basic web skills. Core tasks easily discoverable.
*   **NFR-USA-002: Efficiency:** Minimize steps required for core workflows (upload, respond, choose).
*   **NFR-USA-003: User Interface Clarity:** Uncluttered layout, clear labels, prominent display of important information (status). Clear prompts for location permission.
*   **NFR-USA-004: Accessibility (Basic):** Aim for basic principles (contrast, logical flow, semantic HTML).

**3.3.5 Maintainability Requirements**

*   **NFR-MAIN-001: Code Quality:** Adhere to React and Django best practices. Readable, modular, appropriately commented code.
*   **NFR-MAIN-002: Modularity:** Logical organization of frontend components/services and backend apps/modules.
*   **NFR-MAIN-003: Version Control:** Use Git/GitHub with sensible branching and commit practices.
*   **NFR-MAIN-004: Configuration Management:** Externalize configuration (DB credentials, secrets) using environment variables or config files.

**3.4 Data Requirements**

**3.4.1 Logical Data Model (Conceptual)**

1.  **User:** (UserID PK, Email Unique, PasswordHash, Role, Name fields, Timestamps, IsActive)
2.  **PharmacyProfile:** (ProfileID PK, UserID FK One-to-One, PharmacyName, Address, Latitude, Longitude, Location Point Field - Indexed Spatially)
3.  **PatientProfile:** (Implicit within User for MVP)
4.  **PrescriptionBroadcast:** (BroadcastID PK, PatientUserID FK, SubmissionTimestamp, FileReference, PatientNote, PatientLatitude, PatientLongitude, ChosenPharmacyUserID FK Nullable, OverallStatus, LastUpdateTimestamp)
5.  **PharmacyResponse:** (ResponseID PK, BroadcastID FK, PharmacyUserID FK, ResponseStatus, PharmacyNote, ResponseTimestamp Nullable - Unique(BroadcastID, PharmacyUserID))
6.  **ChatMessage:** (MessageID PK, BroadcastID FK, SenderUserID FK, ReceiverUserID FK, MessageText, Timestamp, IsRead Optional Boolean)

**Relationships:** User has Role. Pharmacy User linked to PharmacyProfile. Patient User creates Broadcasts. Broadcast has Patient Location. System finds nearby Pharmacies. Broadcast triggers multiple PharmacyResponses ('Pending'). Pharmacy updates their Response. Patient views Responses. Patient chooses one Pharmacy (updates Broadcast.ChosenPharmacyUserID, relevant Response statuses). ChatMessages linked to Broadcast between Patient and Chosen Pharmacy.

**3.4.2 Data Persistence**

*   **DP-001: Primary Database:** PostgreSQL with PostGIS extension enabled and configured.
*   **DP-002: Prescription File Storage:** Secure storage for uploaded files (Server filesystem on Render for MVP; Cloud Object Storage like S3 recommended for production).
*   **DP-003: Data Backup:** No specific backup strategy defined for MVP beyond hosting provider defaults.

**4. Proposed Folder Structure**

**4.1 Frontend (React)**

```plaintext
medconnect-frontend/
├── public/
│   └── index.html
│   └── ... (other static assets)
├── src/
│   ├── assets/
│   │   └── images/
│   │   └── styles/ (global styles if needed)
│   ├── components/ (Reusable UI elements - Button, Card, Input, Modal)
│   │   └── common/
│   │   └── layout/ (Navbar, Footer, Layout wrappers)
│   │   └── specific/ (e.g., PharmacyCard, RequestListItem)
│   ├── constants/ (App-wide constants)
│   ├── contexts/ / store/ (State management - Zustand stores)
│   │   └── authStore.js
│   │   └── broadcastStore.js
│   │   └── chatStore.js
│   ├── hooks/ (Custom React hooks - e.g., useAuth, useGeolocation)
│   ├── pages/ / views/ (Top-level route components)
│   │   └── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │   └── PatientDashboard.jsx
│   │   └── PharmacyDashboard.jsx
│   │   └── BroadcastDetailPage.jsx
│   │   └── UploadPage.jsx
│   ├── services/ / api/ (API call functions - Axios instances)
│   │   └── auth.js
│   │   └── broadcasts.js
│   │   └── pharmacies.js
│   │   └── index.js (configure Axios)
│   ├── routes/ (Routing configuration - React Router)
│   │   └── AppRouter.jsx
│   │   └── PrivateRoute.jsx
│   ├── utils/ (Utility functions)
│   ├── App.jsx (Main application component)
│   ├── index.jsx (Entry point)
├── .env (Environment variables)
├── package.json
├── tailwind.config.js
└── README.md
```

**4.2 Backend (Django)**

```plaintext
medconnect-backend/
├── manage.py
├── medconnect_project/ (Project configuration)
│   ├── settings.py
│   ├── urls.py (Project-level URLs)
│   ├── wsgi.py
│   └── asgi.py
├── apps/ (Directory for Django apps)
│   ├── users/ (User management, Profiles, Auth)
│   │   ├── models.py (User, PharmacyProfile)
│   │   ├── serializers.py
│   │   ├── views.py (API Views - DRF ViewSets/APIViews)
│   │   ├── urls.py (App-level URLs)
│   │   └── admin.py
│   │   └── apps.py
│   ├── broadcasts/ (Prescription Broadcasts, Responses)
│   │   ├── models.py (PrescriptionBroadcast, PharmacyResponse)
│   │   ├── serializers.py
│   │   ├── views.py (API Views - incl. geospatial query logic)
│   │   ├── urls.py
│   │   └── admin.py
│   │   └── apps.py
│   ├── chat/ (Chat messaging)
│   │   ├── models.py (ChatMessage)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   │   └── apps.py
├── requirements.txt
├── .env (Environment variables)
├── Dockerfile (Optional for containerization)
└── README.md
```

**5. Design Aesthetic & Theme**

*   **UI Frameworks:** Primarily Tailwind CSS for utility-first styling, complemented by material for pre-built, accessible React components (leveraging material and Tailwind). Material UI could be considered for specific complex components if needed, but primary focus is Tailwind/Shadcn.
*   **Component Style:** Emphasis on Card-based layouts with noticeable shadows (`shadow-md` or `shadow-lg`), rounded corners (`rounded-xl` or `rounded-2xl`), and generous padding/margins for clear visual separation and large tap areas on mobile.
*   **Color Palette:**
    *   **Primary:** Teal (`#14b8a6`) or Emerald (`#10b981`) variants - used for primary buttons, active states, key highlights, potentially headers/navbars. Evokes health and trust.
    *   **Accent/Backgrounds:** Light grays (`#f3f4f6`, `#e5e7eb`) for page backgrounds or distinct sections. White (`#ffffff`) for Card backgrounds to ensure content pops.
    *   **Call-to-Action (CTA):** Primary Green (Teal/Emerald) buttons for positive actions (Submit, Upload, Choose). Secondary/Neutral buttons may use gray or outlined styles. Danger/Rejection actions might use a muted red/orange.
    *   **Text:** Dark grays or black (`#1f2937`, `#374151`) for body text ensuring high contrast and readability.
*   **Typography:**
    *   **Font Family:** Modern, clean sans-serif fonts like `Inter` or `Nunito Sans` (available via Google Fonts or bundled). Ensure good readability at various sizes.
    *   **Hierarchy:** Clear distinction between headings, subheadings, body text, and captions using font size, weight (boldness), and potentially color.

**6. Technology Stack Summary**

*   **Frontend:**
    *   Framework/Library: React.js (v18+) with JavaScript
    *   Styling: Tailwind CSS, Shadcn/UI
    *   State Management: Zustand
    *   Routing: React Router (v6+)
    *   HTTP Client: Axios
    *   Language: JavaScript (ES6+)
*   **Backend:**
    *   Framework: Django (v4+), Django REST Framework (DRF)
    *   Language: Python (v3.9+)
    *   Geospatial: GeoDjango
    *   API Documentation: Swagger/OpenAPI (via `drf-spectacular` or similar)
    *   Authentication: JWT (e.g., `djangorestframework-simplejwt`)
*   **Database:**
    *   PostgreSQL (v14+) with PostGIS extension
*   **Infrastructure & DevOps:**
    *   Frontend Hosting: Vercel
    *   Backend Hosting: Render
    *   CI/CD: GitHub Actions (Setup intended)
    *   Containerization: Docker (Optional, defined in project submission)
    *   Version Control: Git / GitHub
*   **External APIs & Tools (MVP Relevant):**
    *   Browser Geolocation API



**8. Glossary**
*(Selected key terms defined for quick reference - See Section 1.3 for a more comprehensive list).*

*   **Broadcast:** The act of sending a patient's prescription upload to multiple nearby pharmacies.
*   **Geolocation API:** Browser mechanism to determine device location.
*   **MVP:** Minimum Viable Product - core features for initial release/demo.
*   **Pharmacy Response:** A pharmacy's status update ('Available'/'Not Available') for a broadcast.
*   **PostGIS:** PostgreSQL extension for geographic data types and queries.
*   **Mui:** Reusable UI components built using material UI and Tailwind CSS.
*   **Tailwind CSS:** A utility-first CSS framework.

