import api from './index';

export const getBroadcasts = async () => {
  try {
    const response = await api.get('/broadcasts');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch broadcasts' };
  }
};

export const getBroadcastById = async (id) => {
  try {
    const response = await api.get(`/broadcasts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch broadcast' };
  }
};

export const createBroadcast = async (broadcastData) => {
  try {
    const response = await api.post('/broadcasts', broadcastData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create broadcast' };
  }
};

export const updateBroadcast = async (id, broadcastData) => {
  try {
    const response = await api.put(`/broadcasts/${id}`, broadcastData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update broadcast' };
  }
};

export const deleteBroadcast = async (id) => {
  try {
    const response = await api.delete(`/broadcasts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete broadcast' };
  }
}; 