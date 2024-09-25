import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from 'antd';
import Cookies from 'js-cookie';


const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    Cookies.remove('Login');
    navigate('/');
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
    </Box>
  );
};

export default AppLayout;
