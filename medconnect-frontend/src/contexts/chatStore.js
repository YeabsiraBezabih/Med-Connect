import { create } from 'zustand';

const useChatStore = create((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearChat: () => set({ messages: [], currentConversation: null }),
}));

export default useChatStore; 