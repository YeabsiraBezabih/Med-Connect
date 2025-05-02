import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// Mock data
import { getPharmacyById, getChatMessages, mockSendMessage } from '../utils/mockData';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isPharmacy: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const MAX_MESSAGES_PER_USER = 5;

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageSending, setMessageSending] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [pharmacyMessageCount, setPharmacyMessageCount] = useState(0);
  const [chatEnded, setChatEnded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat data and pharmacy info
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // Get pharmacy info
    const pharmacyData = getPharmacyById(id);
    if (!pharmacyData) {
      showToast('Pharmacy not found', 'error');
      navigate('/upload');
      return;
    }
    
    setPharmacy(pharmacyData);
    
    // Get chat messages
    const chatMessages = getChatMessages(id);
    setMessages(chatMessages);
    
    // Count messages
    const userCount = chatMessages.filter(m => !m.isPharmacy).length;
    const pharmacyCount = chatMessages.filter(m => m.isPharmacy).length;
    
    setUserMessageCount(userCount);
    setPharmacyMessageCount(pharmacyCount);
    
    // Check if chat has ended
    if (userCount >= MAX_MESSAGES_PER_USER || pharmacyCount >= MAX_MESSAGES_PER_USER) {
      setChatEnded(true);
    }
    
    setLoading(false);
  }, [id, navigate, showToast]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !id || !user) return;
    if (userMessageCount >= MAX_MESSAGES_PER_USER) {
      showToast('You have reached the maximum number of messages', 'warning');
      return;
    }
    
    setMessageSending(true);
    
    // Prepare new message
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: messageText.trim(),
      timestamp: new Date(),
      isPharmacy: false
    };
    
    // Add message to UI immediately
    setMessages(prev => [...prev, newMessage]);
    setUserMessageCount(prev => prev + 1);
    setMessageText('');
    
    // Send to API (mocked)
    try {
      await mockSendMessage(id, newMessage.text);
      
      // Simulate pharmacy response after some delay
      if (pharmacyMessageCount < MAX_MESSAGES_PER_USER) {
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            senderId: id,
            text: `Thank you for your message. This is an automatic response. ${pharmacyMessageCount + 1 === MAX_MESSAGES_PER_USER ? 'This is our last message. Please call us for further assistance.' : ''}`,
            timestamp: new Date(),
            isPharmacy: true
          };
          
          setMessages(prev => [...prev, response]);
          setPharmacyMessageCount(prev => prev + 1);
          
          // Check if chat has ended
          if ((pharmacyMessageCount + 1) >= MAX_MESSAGES_PER_USER || (userMessageCount + 1) >= MAX_MESSAGES_PER_USER) {
            setChatEnded(true);
          }
        }, 1000 + Math.random() * 2000); // Random delay
      }
    } catch (error) {
      showToast('Failed to send message', 'error');
    } finally {
      setMessageSending(false);
    }
  };

  // Format date
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Pharmacy Header */}
        {pharmacy && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">{pharmacy.name}</h1>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pharmacy.address}</span>
                </div>
              </div>
              <a 
                href={`tel:${pharmacy.phone}`}
                className="btn-outline flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </a>
            </div>
          </div>
        )}
        
        {/* Message Counter */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-blue-800">
                This chat is limited to 5 messages per party. After that, please contact the pharmacy directly.
              </p>
              <div className="flex justify-between mt-2 text-sm">
                <span>You: {userMessageCount}/{MAX_MESSAGES_PER_USER} messages</span>
                <span>Pharmacy: {pharmacyMessageCount}/{MAX_MESSAGES_PER_USER} messages</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start the conversation by sending a message</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isPharmacy ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.isPharmacy 
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isPharmacy ? 'text-gray-500' : 'text-blue-100'}`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t p-4">
            {chatEnded ? (
              <div className="text-center py-2">
                <p className="text-gray-700 font-medium">Chat limit reached</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please call the pharmacy at <a href={`tel:${pharmacy?.phone}`} className="text-blue-500">{pharmacy?.phone}</a> for further assistance
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="input flex-grow"
                  disabled={messageSending || userMessageCount >= MAX_MESSAGES_PER_USER}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || messageSending || userMessageCount >= MAX_MESSAGES_PER_USER}
                  className={`btn-primary px-4 ${
                    (!messageText.trim() || messageSending || userMessageCount >= MAX_MESSAGES_PER_USER)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {messageSending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;