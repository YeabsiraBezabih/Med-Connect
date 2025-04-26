import api from './index';

export const getPharmacies = async () => {
  try {
    const response = await api.get('/pharmacies');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pharmacies' };
  }
};

export const getPharmacyById = async (id) => {
  try {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pharmacy' };
  }
};

export const getNearbyPharmacies = async (latitude, longitude, radius) => {
  try {
    const response = await api.get('/pharmacies/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch nearby pharmacies' };
  }
};

export const updatePharmacyProfile = async (id, pharmacyData) => {
  try {
    const response = await api.put(`/pharmacies/${id}`, pharmacyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update pharmacy profile' };
  }
};

export const getPharmacyInventory = async (id) => {
  try {
    const response = await api.get(`/pharmacies/${id}/inventory`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch pharmacy inventory' };
  }
}; 