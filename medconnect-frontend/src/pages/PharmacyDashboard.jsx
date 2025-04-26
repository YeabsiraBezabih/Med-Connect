import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';

const mockPending = [
  { id: 1, patient: 'Patient A', status: 'Pending', date: '2024-04-25' },
];
const mockChosen = [
  { id: 2, patient: 'Patient B', status: 'Chosen', date: '2024-04-24' },
];

export default function PharmacyDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', px: { xs: 1, md: 4 }, py: { xs: 2, md: 6 } }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="h4" fontWeight={700} color="#26A688" gutterBottom>
            Welcome back, Pharmacy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage incoming prescription requests and connect with patients efficiently.
          </Typography>
        </Box>

        {/* Quick Actions Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'white', height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AssignmentIcon sx={{ color: '#26A688', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    View All Broadcasts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See all prescription broadcasts from patients.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1, bgcolor: '#26A688', borderRadius: '2rem', fontWeight: 600 }}
                    startIcon={<AssignmentIcon />}
                    onClick={() => navigate('/broadcasts')}
                  >
                    View Broadcasts
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
                    Request History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review your accepted and completed requests.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, color: '#26A688', borderColor: '#26A688', borderRadius: '2rem', fontWeight: 600 }}
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/requests/history')}
                  >
                    View History
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Requests Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: 'white', mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#26A688" gutterBottom>
              Pending Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {mockPending.length === 0 ? (
                <Typography color="text.secondary">No pending requests.</Typography>
              ) : (
                mockPending.map((req) => (
                  <ListItem
                    key={req.id}
                    button
                    onClick={() => navigate(`/requests/${req.id}`)}
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
                          <PendingActionsIcon sx={{ color: '#f59e42' }} />
                          <Typography fontWeight={600}>{`Request #${req.id}`}</Typography>
                          <Chip
                            label={req.status}
                            color="warning"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Stack>
                      }
                      secondary={`Patient: ${req.patient} | Date: ${req.date}`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>

        {/* Chosen Requests Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: 'white' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#26A688" gutterBottom>
              Chosen Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {mockChosen.length === 0 ? (
                <Typography color="text.secondary">No chosen requests.</Typography>
              ) : (
                mockChosen.map((req) => (
                  <ListItem
                    key={req.id}
                    button
                    onClick={() => navigate(`/requests/${req.id}`)}
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
                          <CheckCircleIcon sx={{ color: '#26A688' }} />
                          <Typography fontWeight={600}>{`Request #${req.id}`}</Typography>
                          <Chip
                            label={req.status}
                            color="success"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Stack>
                      }
                      secondary={`Patient: ${req.patient} | Date: ${req.date}`}
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