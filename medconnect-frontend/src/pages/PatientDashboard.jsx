import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const mockBroadcasts = [
  { id: 1, status: 'Broadcasting', date: '2024-04-25', pharmacy: null },
  { id: 2, status: 'Completed', date: '2024-04-24', pharmacy: 'ABC Pharmacy' },
];

export default function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', px: { xs: 1, md: 4 }, py: { xs: 2, md: 6 } }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="h4" fontWeight={700} color="#26A688" gutterBottom>
            Welcome back, Patient
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your prescriptions, view your broadcast history, and connect with pharmacies easily.
          </Typography>
        </Box>

        {/* Quick Actions Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'white', height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AddCircleOutlineIcon sx={{ color: '#26A688', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Upload New Prescription
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new broadcast to nearby pharmacies.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1, bgcolor: '#26A688', borderRadius: '2rem', fontWeight: 600 }}
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate('/upload')}
                  >
                    Upload
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'white', height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <HistoryIcon sx={{ color: '#26A688', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Broadcast History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View all your previous prescription broadcasts.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, color: '#26A688', borderColor: '#26A688', borderRadius: '2rem', fontWeight: 600 }}
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/broadcasts')}
                  >
                    View History
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Broadcasts Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: 'white', mt: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#26A688" gutterBottom>
              Recent Broadcasts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {mockBroadcasts.length === 0 ? (
                <Typography color="text.secondary">No broadcasts yet.</Typography>
              ) : (
                mockBroadcasts.map((b) => (
                  <ListItem
                    key={b.id}
                    button
                    onClick={() => navigate(`/broadcasts/${b.id}`)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      boxShadow: 1,
                      bgcolor: '#f9fafb',
                      '&:hover': { bgcolor: '#e0f2f1' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {b.status === 'Completed' ? (
                            <CheckCircleIcon sx={{ color: '#26A688' }} />
                          ) : (
                            <PendingActionsIcon sx={{ color: '#f59e42' }} />
                          )}
                          <Typography fontWeight={600}>{`Broadcast #${b.id}`}</Typography>
                          <Chip
                            label={b.status}
                            color={b.status === 'Completed' ? 'success' : 'warning'}
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Stack>
                      }
                      secondary={b.pharmacy ? (
                        <span>
                          <LocalPharmacyIcon sx={{ fontSize: 18, color: '#26A688', mr: 0.5, mb: '-2px' }} />
                          <b>Chosen Pharmacy:</b> {b.pharmacy}
                        </span>
                      ) : (
                        <span>Date: {b.date}</span>
                      )}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
} 