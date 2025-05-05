import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import chatService, { ChatRoom, ChatMessage } from '../services/chat.service';
import clsx from 'clsx';

const MAX_MESSAGES_PER_USER = 5;

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messageSending, setMessageSending] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [pharmacyMessageCount, setPharmacyMessageCount] = useState(0);
  const [chatEnded, setChatEnded] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Load chat room and messages from backend
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    chatService.getChatRoom(Number(id)).then(room => {
      setChatRoom(room);
      // Find pharmacy participant
      const pharmacyUser = room.participants.find((p: any) => p.user_type === 'pharmacy');
      setPharmacy(pharmacyUser);
    }).catch(() => {
      showToast('Chat room not found', 'error');
      navigate('/dashboard');
    });
    chatService.getChatMessages(Number(id)).then(msgs => {
      setMessages(msgs.reverse()); // Ensure oldest at top, newest at bottom
      setLoading(false);
    }).catch(() => setMessages([]));
  }, [id, navigate, showToast]);

  // Clean up WebSocket on unmount or chat change
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [id]);

  // WebSocket connection for real-time chat
  useEffect(() => {
    if (!id || !user) return;
    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProto}://${window.location.host}/ws/chat/rooms/${id}/`;
    const ws = new window.WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) return;
      setMessages(prev => [...prev, data]);
      scrollToBottom();
    };
    ws.onclose = () => {
      wsRef.current = null;
    };
    return () => {
      ws.close();
    };
  }, [id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !id || !user) return;
    setMessageSending(true);
    try {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(JSON.stringify({ content: messageText.trim() }));
        setMessageText('');
      } else {
        // fallback to REST if websocket not connected
        const newMsg = await chatService.sendMessage(Number(id), messageText.trim());
        setMessages(prev => [...prev, newMsg]);
        setMessageText('');
      }
    } catch {
      showToast('Failed to send message', 'error');
    } finally {
      setMessageSending(false);
    }
  };

  // Format date
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by sender for Telegram-like bubbles
  const renderMessages = () => {
    let lastSenderId: number | null = null;
    return messages.map((msg, idx) => {
      const isUser = msg.sender.id === user?.id;
      const isFirstOfGroup = lastSenderId !== msg.sender.id;
      lastSenderId = msg.sender.id;
      return (
        <div key={msg.id} className={clsx('flex', isUser ? 'justify-end' : 'justify-start', isFirstOfGroup ? 'mt-4' : 'mt-1')}> 
          <div className={clsx(
            'rounded-2xl px-4 py-2 max-w-xs break-words',
            isUser ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-200 text-gray-900 rounded-bl-md',
            isFirstOfGroup ? 'shadow-md' : 'shadow-sm',
            'relative'
          )}>
            <div className="text-sm">{msg.content}</div>
            <div className={clsx('text-xs text-right mt-1', isUser ? 'text-blue-100' : 'text-gray-500')}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      );
    });
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
                <h1 className="text-xl font-bold">{pharmacy.first_name} {pharmacy.last_name}</h1>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pharmacy.address}</span>
                </div>
              </div>
              <a 
                href={`tel:${pharmacy.phone_number}`}
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
        <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden" style={{ minHeight: 300 }}>
          <div className="p-4 space-y-2" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {messages.length === 0 && <div className="text-gray-400 text-center">No messages yet.</div>}
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t p-4">
            {chatEnded ? (
              <div className="text-center py-2">
                <p className="text-gray-700 font-medium">Chat limit reached</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please call the pharmacy at <a href={`tel:${pharmacy?.phone_number}`} className="text-blue-500">{pharmacy?.phone_number}</a> for further assistance
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  disabled={messageSending}
                />
                <button type="submit" className="btn-primary flex items-center gap-1" disabled={messageSending || !messageText.trim()}>
                  <Send className="h-4 w-4" />
                  <span>Send</span>
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