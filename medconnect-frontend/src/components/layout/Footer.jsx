import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'grey.50', color: 'grey.700', py: 4, borderTop: '1px solid #e5e7eb' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            © {new Date().getFullYear()} MedConnect. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="inherit">Privacy Policy</Link>
            <Link href="#" underline="hover" color="inherit">Terms of Service</Link>
            <Link href="#" underline="hover" color="inherit">Contact</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
} 