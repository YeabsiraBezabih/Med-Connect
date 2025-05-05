import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import chatService, { ChatRoom, ChatMessage } from '../../services/chat.service';

const ChatsTab = () => {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Load chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await chatService.getChatRooms();
        setChats(data);
        setFilteredChats(data);
        
        // Select first chat if any
        if (data.length > 0 && !selectedChat) {
          handleSelectChat(data[0]);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast(error.message || 'Failed to load chats', 'error');
        } else {
          showToast('Failed to load chats', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [showToast]);

  // Filter chats when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = chats.filter(
        chat => chat.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               chat.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchTerm, chats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (days < 7) {
      // Within a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  // Select a chat
  const handleSelectChat = async (chat: ChatRoom) => {
    setSelectedChat(chat);

    // Close previous WebSocket if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      // Load messages
      const chatMessages = await chatService.getChatMessages(chat.id);
      setMessages(chatMessages.reverse());

      // Open WebSocket connection
      const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${wsProto}://${window.location.host}/ws/chat/rooms/${chat.id}/`;
      const ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) return;
        setMessages(prev => [...prev, data]);
      };
      ws.onclose = () => {
        wsRef.current = null;
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || 'Failed to load messages', 'error');
      } else {
        showToast('Failed to load messages', 'error');
      }
    }
  };

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;
    
    setSendingMessage(true);
    
    try {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(JSON.stringify({ content: newMessage.trim() }));
        setNewMessage('');
      } else {
        // fallback to REST if websocket not connected
        const message = await chatService.sendMessage(selectedChat.id, newMessage.trim());
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
      // Optionally update chat in list with last message
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || 'Failed to send message', 'error');
      } else {
        showToast('Failed to send message', 'error');
      }
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-16rem)] min-h-[500px]">
      {/* Chat List */}
      <div className="w-full md:w-1/3 border-r overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredChats.length > 0 ? (
            <div>
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">
                          {chat.patient ? `${chat.patient.first_name} ${chat.patient.last_name}` : 'Unknown Patient'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate w-48">
                        {chat.last_message?.content || 'No messages yet'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {chat.last_message ? formatDate(chat.last_message.created_at) : formatDate(chat.created_at)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No chats</h3>
              <p className="text-gray-500">
                {searchTerm ? `No chats match "${searchTerm}"` : 'You have no active chats'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="hidden md:flex md:w-2/3 flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h3 className="font-medium">
                {selectedChat.patient ? `${selectedChat.patient.first_name} ${selectedChat.patient.last_name}` : 'Unknown Patient'}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedChat.patient?.phone_number || ''}
              </p>
            </div>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender.user_type === 'pharmacy' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        message.sender.user_type === 'pharmacy'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender.user_type === 'pharmacy' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start the conversation by sending a message</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input flex-grow"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className={`btn-primary px-4 ${
                    (!newMessage.trim() || sendingMessage)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsTab;