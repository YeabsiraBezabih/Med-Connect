import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField, Stack } from '@mui/material';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setLocation('error')
      );
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    // TODO: Integrate with backend API
    setTimeout(() => {
      setUploading(false);
      alert('Prescription uploaded and broadcasted!');
    }, 1000);
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4 py-8">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent>
          <Typography variant="h5" className="font-bold mb-6 text-center" style={{ color: '#26A688' }}>
            Upload Prescription
          </Typography>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" component="label" sx={{ borderRadius: '1.5rem' }}>
                Image
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
              <Button variant="outlined" component="label" sx={{ borderRadius: '1.5rem' }}>
                PDF
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>
            </Stack>
            {file && <Typography variant="body2">Selected: {file.name}</Typography>}
            <TextField
              label="Optional Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: '#26A688', borderRadius: '1.5rem', fontWeight: 600 }}
              onClick={handleLocation}
              type="button"
            >
              {location ?
                (location === 'error' ? 'Location Error' : `Lat: ${location.lat}, Lon: ${location.lon}`)
                : 'Capture Location'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#26A688', borderRadius: '1.5rem', fontWeight: 600 }}
              disabled={uploading || !file || !location || location === 'error'}
            >
              {uploading ? 'Uploading...' : 'Upload & Broadcast'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 