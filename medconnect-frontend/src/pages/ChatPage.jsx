import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const mockMessages = [
  { id: 1, sender: 'pharmacy', text: 'Your prescription is ready for pickup at 2pm.' },
  { id: 2, sender: 'patient', text: 'Thank you!' },
];


export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: 'patient', text: input }]);
    setInput('');
  };

  return (
    <Box className="min-h-screen flex flex-col bg-[#f3f4f6] px-4 py-8">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg flex flex-col flex-1">
        <CardContent className="flex flex-col flex-1 p-0">
          <Box className="bg-[#26A688] text-white py-4 px-6 rounded-t-2xl">
            <Typography variant="h6">Pharmacy: ABC Meds</Typography>
          </Box>
          <Box className="flex-1 overflow-y-auto px-4 py-2" style={{ minHeight: 300 }}>
            {messages.map((msg) => (
              <Stack
                key={msg.id}
                direction={msg.sender === 'patient' ? 'row-reverse' : 'row'}
                spacing={1}
                className="mb-2"
                alignItems="flex-end"
              >
                <Box
                  className={
                    msg.sender === 'patient'
                      ? 'bg-[#26A688] text-white'
                      : 'bg-gray-200 text-gray-800'
                  }
                  sx={{
                    borderRadius: '1.5rem',
                    px: 2,
                    py: 1,
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Stack>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <form onSubmit={handleSend} className="flex items-center px-4 py-2 border-t">
            <TextField
              variant="outlined"
              placeholder="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              size="small"
              sx={{ borderRadius: '1.5rem', background: 'white' }}
            />
            <IconButton type="submit" color="primary" sx={{ ml: 1, backgroundColor: '#26A688', color: 'white', borderRadius: '50%' }}>
              <SendIcon />
            </IconButton>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 