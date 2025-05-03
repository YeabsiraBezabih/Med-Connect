// Mock Data for MedConnect MVP
// In a real application, this would be replaced with API calls

// Medicines for search
const medicines = [
  'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 
  'Lisinopril', 'Atorvastatin', 'Omeprazole', 'Amlodipine',
  'Ciprofloxacin', 'Aspirin', 'Loratadine', 'Diazepam',
  'Insulin', 'Fluoxetine', 'Azithromycin', 'Simvastatin',
  'Hydrochlorothiazide', 'Metoprolol', 'Levothyroxine'
];

// Mock pharmacies
const pharmacies = [
  { 
    id: '1', 
    name: 'Central Pharmacy', 
    address: 'Bole Road, Addis Ababa',
    phone: '+251912345678',
    location: { lat: 9.0092, lng: 38.7645 }
  },
  { 
    id: '2', 
    name: 'Health First Pharmacy', 
    address: 'Haile G/Selassie Avenue, Addis Ababa',
    phone: '+251923456789',
    location: { lat: 9.0134, lng: 38.7721 }
  },
  { 
    id: '3', 
    name: 'Sunshine Pharmacy', 
    address: 'Meskel Square, Addis Ababa',
    phone: '+251934567890',
    location: { lat: 9.0105, lng: 38.7612 }
  },
  { 
    id: '4', 
    name: 'Ethio Pharmacy', 
    address: 'Churchill Avenue, Addis Ababa',
    phone: '+251945678901',
    location: { lat: 9.0236, lng: 38.7525 }
  },
  { 
    id: '5', 
    name: 'Family Care Pharmacy', 
    address: 'Kazanchis, Addis Ababa',
    phone: '+251956789012',
    location: { lat: 9.0172, lng: 38.7735 }
  }
];

// Search for medicines
export const searchMedicines = (query: string): string[] => {
  return medicines.filter(medicine => 
    medicine.toLowerCase().includes(query.toLowerCase())
  );
};

// Calculate distance between two points
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Get pharmacies with a specific medicine
export const getPharmaciesWithMedicine = (
  medicine: string,
  userLat: number,
  userLng: number
) => {
  return pharmacies.map(pharmacy => {
    const distance = calculateDistance(
      userLat,
      userLng,
      pharmacy.location.lat,
      pharmacy.location.lng
    );
    
    // Random price between 10 and 100 ETB
    const price = Math.floor(Math.random() * 90) + 10;
    
    // Random stock status (80% chance of being in stock)
    const inStock = Math.random() < 0.8;
    
    return {
      id: pharmacy.id,
      name: pharmacy.name,
      distance,
      price,
      inStock,
      address: pharmacy.address,
      phone: pharmacy.phone
    };
  }).sort((a, b) => a.distance - b.distance);
};

// Get pharmacies for prescription
export const getPharmaciesForPrescription = (
  userLat: number,
  userLng: number
) => {
  // Only return a subset of pharmacies (3) with offers
  return pharmacies.slice(0, 3).map(pharmacy => {
    const distance = calculateDistance(
      userLat,
      userLng,
      pharmacy.location.lat,
      pharmacy.location.lng
    );
    
    // Random price between 100 and 500 ETB
    const price = Math.floor(Math.random() * 400) + 100;
    
    // Random ETA
    const etaOptions = ['30 minutes', '1 hour', '2 hours', 'Today'];
    const eta = etaOptions[Math.floor(Math.random() * etaOptions.length)];
    
    return {
      id: pharmacy.id,
      name: pharmacy.name,
      distance,
      price,
      eta,
      address: pharmacy.address
    };
  }).sort((a, b) => a.distance - b.distance);
};

// Get a pharmacy by ID
export const getPharmacyById = (id: string) => {
  return pharmacies.find(pharmacy => pharmacy.id === id);
};

// Mock prescription data
const prescriptions = [
  {
    id: 'p1',
    userId: 'user1',
    userName: 'John Doe',
    image: 'https://images.pexels.com/photos/4021811/pexels-photo-4021811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadDate: new Date(Date.now() - 3600000), // 1 hour ago
    distance: 2.3,
    status: 'new'
  },
  {
    id: 'p2',
    userId: 'user2',
    userName: 'Sarah Ahmed',
    image: 'https://images.pexels.com/photos/4021809/pexels-photo-4021809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadDate: new Date(Date.now() - 7200000), // 2 hours ago
    distance: 1.5,
    status: 'responded'
  },
  {
    id: 'p3',
    userId: 'user3',
    userName: 'Michael Tesfaye',
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    uploadDate: new Date(Date.now() - 86400000), // 1 day ago
    distance: 3.1,
    status: 'accepted'
  }
];

// Get prescriptions for pharmacy
export const getPharmacyPrescriptions = () => {
  return prescriptions;
};

// Respond to prescription
export const respondToPrescription = (
  prescriptionId: string, 
  response: { price: number, eta: string }
) => {
  // In a real app, this would update the database
  const prescription = prescriptions.find(p => p.id === prescriptionId);
  if (prescription) {
    prescription.status = 'responded';
  }
  return true;
};

// Mock chat data
const chats = [
  {
    id: 'chat1',
    userId: 'user1',
    userName: 'John Doe',
    lastMessage: 'Do you have Amoxicillin in stock?',
    lastMessageDate: new Date(Date.now() - 1800000), // 30 minutes ago
    unreadCount: 1,
    status: 'active'
  },
  {
    id: 'chat2',
    userId: 'user2',
    userName: 'Sarah Ahmed',
    lastMessage: 'Thank you, I will be there in an hour.',
    lastMessageDate: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'chat3',
    userId: 'user3',
    userName: 'Michael Tesfaye',
    lastMessage: 'Is the prescription ready?',
    lastMessageDate: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 0,
    status: 'ended'
  }
];

// Get pharmacy chats
export const getPharmacyChats = () => {
  return chats;
};

// Mock chat messages
const chatMessages = {
  chat1: [
    {
      id: 'm1',
      senderId: 'user1',
      text: 'Hello, do you have Amoxicillin in stock?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isPharmacy: false
    },
    {
      id: 'm2',
      senderId: 'pharmacy',
      text: 'Yes, we have Amoxicillin 500mg capsules available.',
      timestamp: new Date(Date.now() - 3500000),
      isPharmacy: true
    },
    {
      id: 'm3',
      senderId: 'user1',
      text: 'Great! What is the price?',
      timestamp: new Date(Date.now() - 1900000),
      isPharmacy: false
    },
    {
      id: 'm4',
      senderId: 'pharmacy',
      text: 'It is 120 ETB for a pack of 10 capsules.',
      timestamp: new Date(Date.now() - 1800000),
      isPharmacy: true
    }
  ],
  chat2: [
    {
      id: 'm1',
      senderId: 'user2',
      text: 'Hi, I uploaded my prescription. Do you have all the medicines?',
      timestamp: new Date(Date.now() - 7200000),
      isPharmacy: false
    },
    {
      id: 'm2',
      senderId: 'pharmacy',
      text: 'Hello Sarah, yes we have all the medicines in your prescription. The total cost will be 350 ETB.',
      timestamp: new Date(Date.now() - 7100000),
      isPharmacy: true
    },
    {
      id: 'm3',
      senderId: 'user2',
      text: 'Perfect! When can I come to pick them up?',
      timestamp: new Date(Date.now() - 4000000),
      isPharmacy: false
    },
    {
      id: 'm4',
      senderId: 'pharmacy',
      text: 'We can have them ready in 30 minutes. You can come anytime after that.',
      timestamp: new Date(Date.now() - 3900000),
      isPharmacy: true
    },
    {
      id: 'm5',
      senderId: 'user2',
      text: 'Thank you, I will be there in an hour.',
      timestamp: new Date(Date.now() - 3600000),
      isPharmacy: false
    }
  ],
  chat3: [
    {
      id: 'm1',
      senderId: 'user3',
      text: 'Hello, I need to refill my blood pressure medication.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      isPharmacy: false
    },
    {
      id: 'm2',
      senderId: 'pharmacy',
      text: 'Hi Michael, do you have a prescription for it?',
      timestamp: new Date(Date.now() - 172700000),
      isPharmacy: true
    },
    {
      id: 'm3',
      senderId: 'user3',
      text: 'Yes, I uploaded it earlier today.',
      timestamp: new Date(Date.now() - 172600000),
      isPharmacy: false
    },
    {
      id: 'm4',
      senderId: 'pharmacy',
      text: 'Got it, we are preparing your medication. It will be ready in about an hour.',
      timestamp: new Date(Date.now() - 172500000),
      isPharmacy: true
    },
    {
      id: 'm5',
      senderId: 'user3',
      text: 'Is the prescription ready?',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isPharmacy: false
    }
  ]
};

// Get chat messages by chat ID
export const getChatMessages = (chatId: string) => {
  return chatMessages[chatId as keyof typeof chatMessages] || [];
};

// Send a message (mock)
export const mockSendMessage = async (chatId: string, text: string) => {
  // In a real app, this would send the message to the server
  // and return the created message
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const messageId = Date.now().toString();
  
  // Return the created message
  return {
    id: messageId,
    senderId: 'pharmacy',
    text,
    timestamp: new Date(),
    isPharmacy: true
  };
};

// User data
// Mock user search history
export const getUserSearchHistory = () => {
  return [
    {
      id: 'sh1',
      medicineName: 'Paracetamol',
      date: new Date(Date.now() - 86400000), // 1 day ago
      pharmaciesViewed: 3
    },
    {
      id: 'sh2',
      medicineName: 'Amoxicillin',
      date: new Date(Date.now() - 259200000), // 3 days ago
      pharmaciesViewed: 2
    },
    {
      id: 'sh3',
      medicineName: 'Metformin',
      date: new Date(Date.now() - 604800000), // 7 days ago
      pharmaciesViewed: 1
    }
  ];
};

// Mock user prescriptions
export const getUserPrescriptions = () => {
  return [
    {
      id: 'up1',
      uploadDate: new Date(Date.now() - 86400000), // 1 day ago
      image: 'https://images.pexels.com/photos/4021811/pexels-photo-4021811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      responseCount: 3,
      status: 'accepted'
    },
    {
      id: 'up2',
      uploadDate: new Date(Date.now() - 259200000), // 3 days ago
      image: 'https://images.pexels.com/photos/3683095/pexels-photo-3683095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      responseCount: 2,
      status: 'expired'
    }
  ];
};

// Mock user chats
export const getUserChats = () => {
  return [
    {
      id: 'chat1',
      pharmacyName: 'Central Pharmacy',
      lastMessageDate: new Date(Date.now() - 1800000), // 30 minutes ago
      messageCount: 4,
      status: 'active'
    },
    {
      id: 'chat3',
      pharmacyName: 'Ethio Pharmacy',
      lastMessageDate: new Date(Date.now() - 86400000), // 1 day ago
      messageCount: 5,
      status: 'ended'
    }
  ];
};

// Mock pharmacy inventory
export const getPharmacyInventory = () => {
  return [
    {
      id: 'med1',
      name: 'Paracetamol 500mg',
      manufacturer: 'Cadila Pharmaceuticals',
      price: 25.50,
      stock: 120,
      expiryDate: new Date(Date.now() + 15552000000) // 6 months from now
    },
    {
      id: 'med2',
      name: 'Amoxicillin 250mg',
      manufacturer: 'Ethiopian Pharmaceuticals',
      price: 120.00,
      stock: 45,
      expiryDate: new Date(Date.now() + 7776000000) // 3 months from now
    },
    {
      id: 'med3',
      name: 'Metformin 500mg',
      manufacturer: 'Cadila Pharmaceuticals',
      price: 85.75,
      stock: 30,
      expiryDate: new Date(Date.now() + 15552000000) // 6 months from now
    },
    {
      id: 'med4',
      name: 'Lisinopril 10mg',
      manufacturer: 'Julphar',
      price: 150.25,
      stock: 18,
      expiryDate: new Date(Date.now() + 23328000000) // 9 months from now
    },
    {
      id: 'med5',
      name: 'Ibuprofen 400mg',
      manufacturer: 'Ethiopian Pharmaceuticals',
      price: 32.50,
      stock: 80,
      expiryDate: new Date(Date.now() + 15552000000) // 6 months from now
    },
    {
      id: 'med6',
      name: 'Atorvastatin 20mg',
      manufacturer: 'Julphar',
      price: 195.00,
      stock: 25,
      expiryDate: new Date(Date.now() + 15552000000) // 6 months from now
    },
    {
      id: 'med7',
      name: 'Omeprazole 20mg',
      manufacturer: 'Cadila Pharmaceuticals',
      price: 75.50,
      stock: 40,
      expiryDate: new Date(Date.now() + 7776000000) // 3 months from now
    },
    {
      id: 'med8',
      name: 'Ciprofloxacin 500mg',
      manufacturer: 'Ethiopian Pharmaceuticals',
      price: 145.00,
      stock: 0,
      expiryDate: new Date(Date.now() + 15552000000) // 6 months from now
    }
  ];
};

// Add medicine to inventory
export const addMedicine = (medicine: any) => {
  const newMedicine = {
    id: `med${Date.now()}`,
    ...medicine
  };
  
  // In a real app, this would add to the database
  return newMedicine;
};

// Update medicine in inventory
export const updateMedicine = (id: string, medicine: any) => {
  // In a real app, this would update the database
  return {
    id,
    ...medicine
  };
};

// Delete medicine from inventory
export const deleteMedicine = (id: string) => {
  // In a real app, this would delete from the database
  return true;
};