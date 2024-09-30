import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Typography, Container, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/ka1.png'; 
import bgImage from '../assets/staff_login.webp'; 
import Cookies from 'js-cookie';

const Login = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageData, setImageData] = useState(null);  // State to store image data
  const videoRef = useRef(null); // To reference the video element
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'auto';
  //   };
  // }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setSnackbarMessage('Location access granted. Please login to continue.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        },
        (error) => {
          console.error('Error getting location: ', error);
          setSnackbarMessage('Location access denied. Please enable location services.');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        }
      );
    } else {
      setSnackbarMessage('Geolocation is not supported by this browser.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!latitude && !longitude) {
      setSnackbarMessage('Location and image access required. Please enable location services and camera access.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if(!imageData) {
      setSnackbarMessage('Image access required. Please enable camera access and click image.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch('https://crpch.in/api/ka/login/staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileno: mobileNo,
          password: password,
          lat: latitude,
          longt: longitude,
          image: imageData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('id', result.data.id);
        setSnackbarMessage('Login successful');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        Cookies.set('Login', 'true', { expires: 7 });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setSnackbarMessage(result.message || 'Invalid credentials');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Camera handling
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setSnackbarMessage('Error accessing camera.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error opening camera: ', error);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    setImageData(imageDataUrl); // Store the captured image
    // Stop the video stream
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // Close the camera
    setSnackbarMessage('Photo captured successfully.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

  };

  console.log('latitude', latitude);
  console.log('longitude', longitude);
  console.log('imageData', imageData);

  return (
    <Container maxWidth={false} disableGutters sx={{ display: 'flex', height: '100vh'}}>
      {/* Left container with background image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' },
          height: '100vh'
        }}
      />
      {/* Right container with logo and login form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 40px',
          height: '100vh',
        }}
      >
        
        <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Staff Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Mobile Number"
              fullWidth
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Password"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>

          {/* Button to open camera and take photo */}
          <Button onClick={openCamera} fullWidth variant="outlined" color="secondary" sx={{ mt: 2 }}>
            Open Camera
          </Button>
          <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>

          <Button onClick={takePhoto} fullWidth variant="outlined" color="secondary" sx={{ mt: 2 }}>
            Take Photo
          </Button>
        </Box>
         {imageData && <img src={imageData} alt="Captured" style={{ marginTop: '20px', width: '100%' }} />}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
