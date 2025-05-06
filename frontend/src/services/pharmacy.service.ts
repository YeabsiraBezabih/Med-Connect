import api from './api';
import { Order } from './user.service';

export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  pharmacy: number;
  expire_date: string;
  discount: number;
  requires_prescription: boolean;
  created_at: string;
  updated_at: string;
  image?: string;
}

export interface PrescriptionResponse {
  id: number;
  prescription_image?: string;
  latitude?: string;
  longitude?: string;
  medicine: Medicine | null;
  pharmacy: number | null;
  patient: number;
  price?: number;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected' | 'approved';
  created_at: string;
  updated_at?: string;
  chat_room_id?: number;
}

export interface OrderItem {
  id: number;
  order: number;
  medicine: Medicine;
  quantity: number;
  price: number;
}

export interface CreateMedicineData {
  name: string;
  description: string;
  price: number;
  expire_date: string;
  stock: number;
  requires_prescription: boolean;
  pharmacy: number;
}

const pharmacyService = {
  // Medicine management
  getMedicines: async (): Promise<Medicine[]> => {
    try {
      const response = await api.get('/pharmacy/medicines/');
      return response.data;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  getMedicineById: async (id: number): Promise<Medicine> => {
    try {
      const response = await api.get(`/pharmacy/medicines/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicine:', error);
      throw error;
    }
  },

  createMedicine: async (data: CreateMedicineData): Promise<Medicine> => {
    try {
      console.log('Making POST request with data:', data); // Debug log
      const response = await api.post('/pharmacy/medicines/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  },

  updateMedicine: async (id: number, data: Partial<Medicine>): Promise<Medicine> => {
    try {
      const response = await api.patch(`/pharmacy/medicines/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  deleteMedicine: async (id: number): Promise<void> => {
    try {
      await api.delete(`/pharmacy/medicines/${id}/`);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },

  // Prescription management
  getPrescriptions: async (): Promise<PrescriptionResponse[]> => {
    const response = await api.get('/pharmacy/prescriptions/');
    return response.data;
  },

  getPrescriptionResponses: async (prescriptionId: number): Promise<PrescriptionResponse[]> => {
    const response = await api.get(`/pharmacy/prescriptions/${prescriptionId}/responses/`);
    return response.data;
  },

  respondToPrescription: async (prescriptionId: number, data: { price: number; notes?: string }): Promise<PrescriptionResponse> => {
    const response = await api.post(`/pharmacy/prescriptions/${prescriptionId}/respond/`, data);
    return response.data;
  },

  acceptPrescription: async (prescriptionId: number): Promise<{ chat_room_id: number }> => {
    const response = await api.post(`/pharmacy/prescriptions/${prescriptionId}/accept/`);
    return response.data;
  },

  // Order management
  getOrderDetails: async (orderId: number): Promise<{ order: Order; items: OrderItem[] }> => {
    const response = await api.get(`/pharmacy/orders/${orderId}/`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/pharmacy/orders/${orderId}/`, { status });
    return response.data;
  },

  // Search medicines
  searchMedicines: async (query: string): Promise<Medicine[]> => {
    const response = await api.get('/pharmacy/medicines/search/', {
      params: { query }
    });
    return response.data;
  }
};

export default pharmacyService; 