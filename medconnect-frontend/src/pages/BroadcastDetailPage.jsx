import React from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mockBroadcast = {
  id: 1,
  status: 'Broadcasting',
  file: 'prescription1.pdf',
  note: 'Take with food',
  responses: [
    { id: 1, pharmacy: 'ABC Pharmacy', status: 'Available' },
    { id: 2, pharmacy: 'XYZ Pharmacy', status: 'Not Available' },
  ],
};

export default function BroadcastDetailPage() {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <Card className="rounded-2xl shadow-md mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-2">Prescription Details</Typography>
          <Typography variant="body2">File: {mockBroadcast.file}</Typography>
          <Typography variant="body2">Note: {mockBroadcast.note}</Typography>
          <Typography variant="body2" className="mt-2">Status: <span className="font-semibold">{mockBroadcast.status}</span></Typography>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-md mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-2">Pharmacy Responses</Typography>
          <List>
            {mockBroadcast.responses.map((r) => (
              <ListItem key={r.id} className="flex justify-between items-center">
                <ListItemText
                  primary={r.pharmacy}
                  secondary={`Status: ${r.status}`}
                />
                {r.status === 'Available' && (
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#26A688', borderRadius: '1.5rem', fontWeight: 600 }}
                    onClick={() => alert('Pharmacy chosen!')}
                  >
                    Choose
                  </Button>
                )}
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '1.5rem', color: '#26A688', borderColor: '#26A688', ml: 2 }}
                  onClick={() => navigate(`/chat/${r.id}`)}
                >
                  Chat
                </Button>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
} 