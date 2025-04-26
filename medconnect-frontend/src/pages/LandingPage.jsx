import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Grid, Container, useTheme, useMediaQuery, IconButton, Modal } from '@mui/material';
import { MapPin, MessageSquare, Cpu, Eye } from 'lucide-react';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import heroImage from '../assets/images/hero.avif';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const features = [
  {
    icon: <Cpu sx={{ fontSize: 40, color: '#26A688' }} />,
    title: 'OCR Scanning',
    description: 'Extracts drug names from images or PDFs for quick processing.',
  },
  {
    icon: <Eye sx={{ fontSize: 40, color: '#26A688' }} />,
    title: 'AI Suggestions',
    description: 'Recommends generics and flags potential interactions using AI.',
  },
  {
    icon: <MessageSquare sx={{ fontSize: 40, color: '#26A688' }} />,
    title: 'Real-time Sync',
    description: "Inventory updates push instantly, so you always know what's in stock.",
  },
  {
    icon: <MapPin sx={{ fontSize: 40, color: '#26A688' }} />,
    title: 'Location Maps',
    description: 'Find the nearest pharmacy with available medication in minutes.',
  },
];

const stats = [
  { number: '200+', label: 'Pharmacies Connected', icon: <LocalPharmacyIcon sx={{ color: '#26A688', fontSize: 32 }} /> },
  { number: '5,000+', label: 'Prescriptions Fulfilled', icon: <AssignmentTurnedInIcon sx={{ color: '#26A688', fontSize: 32 }} /> },
  { number: '10,000+', label: 'Patients Served', icon: <PeopleAltIcon sx={{ color: '#26A688', fontSize: 32 }} /> },
  { number: '24/7', label: 'Support', icon: <AccessTimeIcon sx={{ color: '#26A688', fontSize: 32 }} /> },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  // Glassmorphic blur style
  const blurStyle = modal
    ? {
        filter: 'blur(8px)',
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'filter 0.3s',
      }
    : {};

  return (
    <Box>
      <Navbar />
      {/* Main Content with conditional blur */}
      <Box style={blurStyle}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '90vh', md: '80vh' },
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Parallax Hero Image */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: isMobile ? 'scroll' : 'fixed',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(38,166,136,0.85) 0%, rgba(38,166,136,0.7) 100%)',
              },
            }}
          />
          {/* Hero Content */}
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}
                >
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      mb: 2,
                      fontWeight: 700,
                      fontSize: { xs: '2.2rem', md: '3.2rem' },
                      lineHeight: 1.15,
                      textAlign: 'left',
                    }}
                  >
                    Find Nearby Pharmacies & Get Your Meds Fast
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      mb: 4,
                      opacity: 0.92,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      fontWeight: 400,
                      textAlign: 'left',
                    }}
                  >
                    Upload your prescription, broadcast to local pharmacies, and chat with the one that has your meds—all in one secure platform.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: '#26A688',
                        py: 1.5,
                        px: 4,
                        borderRadius: '50px',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => setModal('register')}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        py: 1.5,
                        px: 4,
                        borderRadius: '50px',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'grey.100',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-3px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => setModal('login')}
                    >
                      Login
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 6, bgcolor: '#26A688', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          background: 'linear-gradient(45deg, #26A688, #10b981)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 700,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 4,
                  bgcolor: '#26A688',
                  borderRadius: 2,
                },
              }}
            >
              Why MedConnect?
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: '#26A688',
                        mb: 2,
                        p: 3,
                        borderRadius: '50%',
                        bgcolor: 'rgba(38, 166, 136, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Call to Action Section */}
        <Box
          sx={{
            bgcolor: '#26A688',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Ready to simplify your healthcare?
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  mb: 6,
                  opacity: 0.9,
                  maxWidth: 'md',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Join MedConnect today and experience a new era of prescription fulfillment and pharmacy connection.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 3,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#26A688',
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setModal('register')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setModal('login')}
                >
                  Login
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>
      <Footer />

      {/* Pop-out Modal for Login/Register */}
      <Modal
        open={modal === 'login' || modal === 'register'}
        onClose={() => setModal(null)}
        aria-labelledby="auth-modal"
        sx={{ zIndex: 2000 }}
        closeAfterTransition
        disableAutoFocus
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(38, 166, 136, 0.15)',
            backdropFilter: 'blur(8px)',
            zIndex: 2001,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: '95vw', sm: 420 },
              maxWidth: 480,
              bgcolor: 'rgba(255,255,255,0.85)',
              borderRadius: 4,
              boxShadow: 8,
              p: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              minHeight: 420,
            }}
          >
            <IconButton
              onClick={() => setModal(null)}
              sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10, bgcolor: 'rgba(38,166,136,0.08)' }}
              aria-label="Back"
            >
              <ArrowBackIcon sx={{ color: '#26A688' }} />
            </IconButton>
            <Box sx={{ mt: 5 }}>
              {modal === 'login' ? <LoginPage /> : <RegisterPage />}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
} 