import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: '#26A688', boxShadow: 2 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/') }>
            <LocalPharmacyIcon sx={{ mr: 1, fontSize: 32, color: '#26A688' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#26A688', letterSpacing: 1 }}>
              MedConnect
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
            <Button color="inherit" onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}>Features</Button>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="contained" sx={{ bgcolor: '#26A688', color: 'white', borderRadius: '2rem', fontWeight: 600, ml: 1 }} onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 