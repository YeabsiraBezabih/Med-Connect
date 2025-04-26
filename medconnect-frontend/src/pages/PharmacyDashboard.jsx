import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';

const mockPending = [
  { id: 1, patient: 'Patient A', status: 'Pending', date: '2024-04-25' },
];
const mockChosen = [
  { id: 2, patient: 'Patient B', status: 'Chosen', date: '2024-04-24' },
];

export default function PharmacyDashboard() {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <Typography variant="h5" className="font-bold mb-4" style={{ color: '#26A688' }}>
        Welcome, Pharmacy
      </Typography>
      <Card className="rounded-2xl shadow-md mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-2">Pending Requests</Typography>
          <List>
            {mockPending.map((r) => (
              <ListItem key={r.id} button onClick={() => navigate(`/responses/${r.id}`)}>
                <ListItemText
                  primary={`From: ${r.patient}`}
                  secondary={`Status: ${r.status} | Date: ${r.date}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-md">
        <CardContent>
          <Typography variant="h6" className="mb-2">Chosen Requests</Typography>
          <List>
            {mockChosen.map((r) => (
              <ListItem key={r.id} button onClick={() => navigate(`/responses/${r.id}`)}>
                <ListItemText
                  primary={`From: ${r.patient}`}
                  secondary={`Status: ${r.status} | Date: ${r.date}`}
                />
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '1.5rem', color: '#26A688', borderColor: '#26A688', ml: 2 }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/chat/${r.id}`); }}
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