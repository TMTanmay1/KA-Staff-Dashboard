import React from 'react';
import { Box, Toolbar, Typography, Snackbar,
  Alert, } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from 'antd';
import Cookies from 'js-cookie';
import axios from 'axios';

const AppLayout = () => {
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleLogout = async() => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('https://crpch.in/api/ka/staff/logout/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      localStorage.removeItem('authToken');
      Cookies.remove('Login');
      navigate('/');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to logout');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } 
  }
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderBottom: '1px solid #ddd',
            padding: '8px 16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            height: '64px', // Match the height of the Sidebar
          }}
        >
          <Typography variant="h6">Krishna Academy</Typography>

          <Button type="primary" style={{ marginLeft: 'auto', backgroundColor:'red' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
          {/* You can add more elements here if needed */}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#fff',
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppLayout;
