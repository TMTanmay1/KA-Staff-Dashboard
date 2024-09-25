import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Disable body scroll on mount
    document.body.style.overflow = 'hidden';
    
    // Clean up by re-enabling scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (Cookies.get('Login')) {
      navigate('/dashboard');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://crpch.in/api/ka/login/staff/', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileno: mobileNo,
          password: password,
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

      
        // navigate('/dashboard');
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

  return (
    <Container maxWidth={false} disableGutters sx={{ display: 'flex', height: '100vh',  overflow: 'hidden' }}>
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
             textAlign: 'center'
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
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Login;
