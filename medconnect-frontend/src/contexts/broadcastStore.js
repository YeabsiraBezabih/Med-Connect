import { create } from 'zustand';
import { searchBroadcasts } from '../services/broadcasts';

const useBroadcastStore = create((set) => ({
  broadcasts: [],
  currentBroadcast: null,
  loading: false,
  error: null,
  searchResults: [],
  setBroadcasts: (broadcasts) => set({ broadcasts }),
  setCurrentBroadcast: (broadcast) => set({ currentBroadcast: broadcast }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addBroadcast: (broadcast) => 
    set((state) => ({ broadcasts: [...state.broadcasts, broadcast] })),
  updateBroadcast: (id, updatedBroadcast) =>
    set((state) => ({
      broadcasts: state.broadcasts.map((broadcast) =>
        broadcast.id === id ? updatedBroadcast : broadcast
      ),
    })),
  deleteBroadcast: (id) =>
    set((state) => ({
      broadcasts: state.broadcasts.filter((broadcast) => broadcast.id !== id),
    })),
  searchBroadcasts: async (query) => {
    set({ loading: true, error: null });
    try {
      const results = await searchBroadcasts(query);
      set({ searchResults: results, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  clearSearchResults: () => set({ searchResults: [] }),
}));

export default useBroadcastStore; 