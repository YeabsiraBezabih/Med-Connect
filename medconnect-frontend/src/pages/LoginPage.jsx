import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box, Link } from '@mui/material';
import { login as loginUser } from '../services/auth';
import useAuthStore from '../contexts/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ email, password });
      setToken(data.access);
      setIsAuthenticated(true);
      setLoading(false);
      // On success, redirect to dashboard
      if (data.user_type === 'patient') {
        navigate('/patient/dashboard');
      } else {
        navigate('/pharmacy/dashboard');
      }
    } catch (err) {
      setError(err?.detail || err?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent>
          <Typography variant="h5" className="font-bold mb-6 text-center" style={{ color: '#26A688' }}>
            Login to MedConnect
          </Typography>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Typography className="pt-4 text-center" variant="body2">
            Don't have an account?{' '}
            <Link href="#" onClick={() => navigate('/register')} underline="hover" style={{ color: '#26A688' }}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
} 