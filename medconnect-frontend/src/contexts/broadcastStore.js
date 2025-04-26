import { create } from 'zustand';

const useBroadcastStore = create((set) => ({
  broadcasts: [],
  currentBroadcast: null,
  loading: false,
  error: null,
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
}));

export default useBroadcastStore; 