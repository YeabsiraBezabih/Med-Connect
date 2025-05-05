import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PRE_PROMPT = `You are MedConnect, a helpful virtual pharmacy assistant for patients in Ethiopia.

You help users by:
- Explaining what medicines do
- Suggesting what medicine might be needed (based on symptoms, not diagnosing)
- Explaining dosage and usage instructions (based on general guidelines)
- Guiding them to upload prescriptions or search nearby pharmacies
- Helping users interact with the MedConnect platform (e.g., how to upload a photo or check chat)

NEVER diagnose conditions. ALWAYS recommend seeing a doctor for serious or specific cases.

Respond clearly and politely, in simple English or local terms when possible. Be brief but informative.
`;

interface ChatBotModalProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LOCAL_STORAGE_KEY = 'medconnect_chatbot_history';

const ChatBotModal: React.FC<ChatBotModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hi! I\'m MedConnect\'s AI assistant. How can I help you today?' },
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: PRE_PROMPT }] },
            ...[...messages, userMessage].map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          ],
        }),
      });
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';
      setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative flex flex-col max-h-[80vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-2 text-center">MedConnect AI Chatbot</h2>
        <div className="flex-1 overflow-y-auto mb-2 px-1" style={{ minHeight: 200 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal; 