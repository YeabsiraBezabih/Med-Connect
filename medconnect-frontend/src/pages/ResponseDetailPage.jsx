import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mockResponse = {
  id: 1,
  patient: 'Patient A',
  file: 'prescription1.pdf',
  note: 'Take with food',
  status: 'Pending',
};

export default function ResponseDetailPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(mockResponse.status);

  const handleRespond = (resp) => {
    setStatus(resp);
    // TODO: Integrate with backend
    alert(`Responded: ${resp}`);
  };

  return (
    <Box className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <Card className="rounded-2xl shadow-md mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-2">Prescription Request</Typography>
          <Typography variant="body2">Patient: {mockResponse.patient}</Typography>
          <Typography variant="body2">File: {mockResponse.file}</Typography>
          <Typography variant="body2">Note: {mockResponse.note}</Typography>
          <Typography variant="body2" className="mt-2">Status: <span className="font-semibold">{status}</span></Typography>
        </CardContent>
      </Card>
      {status === 'Pending' && (
        <Stack direction="row" spacing={2} className="mb-6" justifyContent="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#26A688', borderRadius: '1.5rem', fontWeight: 600 }}
            onClick={() => handleRespond('Available')}
          >
            Available
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: '1.5rem', color: '#26A688', borderColor: '#26A688' }}
            onClick={() => handleRespond('Not Available')}
          >
            Not Available
          </Button>
        </Stack>
      )}
      <Button
        variant="outlined"
        sx={{ borderRadius: '1.5rem', color: '#26A688', borderColor: '#26A688' }}
        onClick={() => navigate(`/chat/${mockResponse.id}`)}
      >
        Chat
      </Button>
    </Box>
  );
} 