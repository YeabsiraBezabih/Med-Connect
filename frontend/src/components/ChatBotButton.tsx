import React, { useState } from 'react';
import ChatBotModal from './ChatBotModal';

const RobotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-robot"><rect x="3" y="8" width="18" height="8" rx="2"/><rect x="7" y="16" width="10" height="4" rx="2"/><circle cx="8.5" cy="12" r="1.5"/><circle cx="15.5" cy="12" r="1.5"/><path d="M12 8V4M9 4h6"/></svg>
);

const ChatBotButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[10000] bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none"
        aria-label="Open Chatbot"
      >
        <RobotIcon />
      </button>
      {open && <ChatBotModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatBotButton; 