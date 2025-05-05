from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import PatientProfile, PharmacyProfile, SearchHistory
from pharmacy.models import Medicine, Prescription, Order, OrderItem
from chat.models import ChatRoom, Message
from django.utils import timezone
import random
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with mock data for testing.'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Message.objects.all().delete()
        ChatRoom.objects.all().delete()
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Prescription.objects.all().delete()
        Medicine.objects.all().delete()
        SearchHistory.objects.all().delete()
        PatientProfile.objects.all().delete()
        PharmacyProfile.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        # Create users
        patients = []
        pharmacies = []
        # Add 10 realistic Ethiopian users
        user_infos = [
            ("Abebe Kebede", "abebe.kebede@example.com", "0912345671"),
            ("Mekdes Tadesse", "mekdes.tadesse@example.com", "0912345672"),
            ("Samuel Getachew", "samuel.getachew@example.com", "0912345673"),
            ("Hanna Alemu", "hanna.alemu@example.com", "0912345674"),
            ("Biruk Tesfaye", "biruk.tesfaye@example.com", "0912345675"),
            ("Selamawit Fikre", "selamawit.fikre@example.com", "0912345676"),
            ("Yared Mulugeta", "yared.mulugeta@example.com", "0912345677"),
            ("Ruth Solomon", "ruth.solomon@example.com", "0912345678"),
            ("Fitsum Asfaw", "fitsum.asfaw@example.com", "0912345679"),
            ("Lidya Worku", "lidya.worku@example.com", "0912345680"),
        ]
        for i, (full_name, email, phone) in enumerate(user_infos):
            first_name, last_name = full_name.split()
            user = User.objects.create_user(
                username=f'user{i}',
                email=email,
                password='testpass123',
                first_name=first_name,
                last_name=last_name,
                is_staff=False,
                user_type='patient',
                phone_number=phone,
                address=f'{full_name} Address, Addis Ababa'
            )
            patients.append(user)

        # Realistic pharmacy data
        pharmacy_infos = [
            ("Addis Ababa Pharmacy", "Bole Road, Addis Ababa", "0911000001"),
            ("St. Gabriel Pharmacy", "St. Gabriel Area, Addis Ababa", "0911000002"),
            ("Bethel Pharmacy", "Bethel, Addis Ababa", "0911000003"),
            ("Hayat Pharmacy", "Hayat Hospital, Addis Ababa", "0911000004"),
            ("Medina Pharmacy", "Megenagna, Addis Ababa", "0911000005"),
            ("Tikur Anbessa Pharmacy", "Tikur Anbessa Hospital, Addis Ababa", "0911000006"),
            ("Gullele Pharmacy", "Gullele, Addis Ababa", "0911000007"),
            ("CMC Pharmacy", "CMC, Addis Ababa", "0911000008"),
            ("Bole Medhanialem Pharmacy", "Bole Medhanialem, Addis Ababa", "0911000009"),
            ("Kazanchis Pharmacy", "Kazanchis, Addis Ababa", "0911000010"),
            ("Arat Kilo Pharmacy", "Arat Kilo, Addis Ababa", "0911000011"),
            ("Piassa Pharmacy", "Piassa, Addis Ababa", "0911000012"),
            ("Mexico Pharmacy", "Mexico Square, Addis Ababa", "0911000013"),
            ("Saris Pharmacy", "Saris, Addis Ababa", "0911000014"),
            ("Lideta Pharmacy", "Lideta, Addis Ababa", "0911000015"),
            ("Megenagna Pharmacy", "Megenagna, Addis Ababa", "0911000016"),
            ("Summit Pharmacy", "Summit, Addis Ababa", "0911000017"),
            ("Gurd Shola Pharmacy", "Gurd Shola, Addis Ababa", "0911000018"),
            ("Ayat Pharmacy", "Ayat, Addis Ababa", "0911000019"),
            ("Bambis Pharmacy", "Bambis, Addis Ababa", "0911000020"),
        ]
        for i, (name, address, phone) in enumerate(pharmacy_infos):
            user = User.objects.create_user(
                username=f'pharmacy{i}',
                email=f'pharmacy{i}@example.com',
                password='testpass123',
                first_name=name.split()[0],
                last_name='Pharmacy',
                is_staff=True,
                user_type='pharmacy',
                phone_number=phone,
                address=address
            )
            pharmacies.append(user)

        # Create patient and pharmacy profiles
        addis_lat, addis_lng = 9.019, 38.752
        patient_profiles = [
            PatientProfile.objects.create(
                user=u,
                date_of_birth=date.today() - timedelta(days=365*random.randint(20, 40)),
                medical_history=f'Medical history {i}',
                allergies=f'Allergy {i}'
            ) for i, u in enumerate(patients)
        ]
        pharmacy_profiles = [
            PharmacyProfile.objects.create(
                user=u,
                license_number=f'LIC-{i+1000}',
                business_name=pharmacy_infos[i][0],
                operating_hours='9am-9pm',
                is_verified=bool(i % 2),
                latitude=addis_lat + random.uniform(-0.03, 0.03),
                longitude=addis_lng + random.uniform(-0.03, 0.03)
            ) for i, u in enumerate(pharmacies)
        ]

        # Realistic medicine names
        medicine_names = [
            "Paracetamol", "Amoxicillin", "Ibuprofen", "Metformin", "Amlodipine", "Omeprazole", "Atorvastatin", "Ciprofloxacin", "Azithromycin", "Losartan",
            "Simvastatin", "Salbutamol", "Prednisolone", "Diclofenac", "Ceftriaxone", "Doxycycline", "Hydrochlorothiazide", "Furosemide", "Enalapril", "Clopidogrel",
            "Insulin", "Lisinopril", "Ranitidine", "Amoxicillin-Clavulanate", "Tramadol", "Cetirizine", "Loratadine", "Aspirin", "Warfarin", "Glibenclamide", "Nifedipine",
            "Spironolactone", "Gentamicin", "Erythromycin", "Mebendazole", "Albendazole", "Chloramphenicol", "Miconazole", "Ketoconazole", "Fluconazole", "Vitamin C"
        ]

        # Create medicines (each linked to a pharmacy, 20-40 per pharmacy, no duplicates per pharmacy)
        medicines = []
        for i, pharmacy in enumerate(pharmacy_profiles):
            num_meds = random.randint(20, 40)
            meds_for_pharmacy = random.sample(medicine_names, min(num_meds, len(medicine_names)))
            for med_name in meds_for_pharmacy:
                med = Medicine.objects.create(
                    name=med_name,
                    description=f'{med_name} description',
                    price=round(random.uniform(5, 100), 2),
                    stock=random.randint(10, 200),
                    pharmacy=pharmacy,
                    requires_prescription=random.choice([True, False])
                )
                medicines.append(med)

        # Create search history
        for patient in patient_profiles:
            for i in range(2):
                SearchHistory.objects.create(user=patient.user, query=f'search term {i}')

        self.stdout.write(self.style.SUCCESS('Mock data populated successfully!')) 