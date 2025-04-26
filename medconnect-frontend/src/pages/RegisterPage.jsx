import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box, Link, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { register as registerUser } from '../services/auth';
import useAuthStore from '../contexts/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole) setRole(newRole);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      let payload = {
        user_type: role,
        email: form.email,
        password: form.password,
      };
      if (role === 'patient') {
        payload.first_name = form.firstName;
        payload.last_name = form.lastName;
      } else {
        payload.username = form.pharmacyName;
        payload.address = form.address;
        payload.latitude = form.latitude;
        payload.longitude = form.longitude;
      }
      const data = await registerUser(payload);
      setToken(data.access);
      setIsAuthenticated(true);
      setLoading(false);
      if (role === 'pharmacy') {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/patient/dashboard');
      } 
    } catch (err) {
      setError(err?.detail || err?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <Box className=" flex items-center justify-center bg-[#f3f4f6] ">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent>
          <Typography variant="h5" className="font-bold mb-6 text-center" style={{ color: '#26A688' }}>
            Register for MedConnect
          </Typography>
          <Box className="flex justify-center mb-4">
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={handleRoleChange}
              aria-label="user role"
              color="primary"
            >
              <ToggleButton value="patient" sx={{ px: 4, fontWeight: 600 }}>Patient</ToggleButton>
              <ToggleButton value="pharmacy" sx={{ px: 4, fontWeight: 600 }}>Pharmacy</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {role === 'patient' ? (
              <>
                <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required fullWidth />
                <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required fullWidth />
              </>
            ) : (
              <>
                <TextField label="Pharmacy Name" name="pharmacyName" value={form.pharmacyName} onChange={handleChange} required fullWidth />
                <TextField label="Address" name="address" value={form.address} onChange={handleChange} required fullWidth />
                <Box className="flex gap-2">
                  <TextField label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} required fullWidth />
                  <TextField label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} required fullWidth />
                </Box>
              </>
            )}
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />
            <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required fullWidth />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#26A688',
                color: 'white',
                borderRadius: '1.5rem',
                fontWeight: 600,
                py: 1.5,
                mt: 2,
                '&:hover': { backgroundColor: '#1F7D6F' },
              }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <Typography className="mt-4 text-center" variant="body2">
            Already have an account?{' '}
            <Link href="#" onClick={() => navigate('/login')} underline="hover" style={{ color: '#26A688' }}>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
} 