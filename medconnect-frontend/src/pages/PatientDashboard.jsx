import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';

const mockBroadcasts = [
  { id: 1, status: 'Broadcasting', date: '2024-04-25', pharmacy: null },
  { id: 2, status: 'Completed', date: '2024-04-24', pharmacy: 'ABC Pharmacy' },
];

export default function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <Typography variant="h5" className="font-bold mb-4" style={{ color: '#26A688' }}>
        Welcome, Patient
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: '#26A688', borderRadius: '1.5rem', fontWeight: 600, mb: 4 }}
        onClick={() => navigate('/upload')}
      >
        Upload Prescription
      </Button>
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <Typography variant="h6" className="mb-2">Recent Broadcasts</Typography>
          <List>
            {mockBroadcasts.map((b) => (
              <ListItem key={b.id} button onClick={() => navigate(`/broadcasts/${b.id}`)}>
                <ListItemText
                  primary={`Broadcast #${b.id} - ${b.status}`}
                  secondary={b.pharmacy ? `Chosen Pharmacy: ${b.pharmacy}` : `Date: ${b.date}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
} 