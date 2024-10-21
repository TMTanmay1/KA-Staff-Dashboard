import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Snackbar, Alert, Dialog, DialogContent } from '@mui/material';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Tooltip } from '@mui/material';

function StaffAttendance() {
    const navigate = useNavigate();
  const Token = localStorage.getItem('authToken');
  const break_time = localStorage.getItem('break_time');  
  const id =  localStorage.getItem('id');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [image, setImage] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [countdown, setCountdown] = useState(break_time);
  const [isBreakOpen, setIsBreakOpen] = useState(false); 
  const [isBreakPaused, setIsBreakPaused] = useState(false);

  const [disablePunchOut, setDisablePunchOut] = useState(false);
  const [disablePunchIn, setDisablePunchIn] = useState(false);
  const [isBreakDisabled, setIsBreakDisabled] = useState(false);
  const [enablePunchOut, setEnablePunchOut] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setSnackbarMessage('Location access granted');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        },
        (error) => {
          console.error('Error fetching location', error);
          setSnackbarMessage('Location access denied, please enable location services');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }, []);

  // Handle image capture
  const captureImage = () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        video.addEventListener('loadeddata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          setImage(canvas.toDataURL('image/png'));
          stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
        });
      })
      .catch(err => console.error('Error accessing camera:', err));
  };

  // Function to get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Ensure two digits
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure two digits
    return `${hours}:${minutes}`; // Return in HH:mm format 
  };
  

  // Function to get today's date
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];  // YYYY-MM-DD
  };


  useEffect(() => {
    const punchedIn = Cookies.get('punchedIn');
    const punchedOut = Cookies.get('punchedOut');
  
    if (punchedIn) {
      setDisablePunchIn(true);
      setEnablePunchOut(true);
    }
  
    if (punchedOut) {
      setDisablePunchOut(true);
    }
  
    // Optional: You could also clear cookies manually after some logic or action
  }, []);

  
  // Function to handle API call for punch in/out
  const handlePunch = async (actionType) => {

    if(!location.latitude && !location.longitude) {
        setSnackbarMessage('Location not available');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    if(!image) {
        setSnackbarMessage('Please capture an image');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    const loginTime = actionType === 'punchin' ? getCurrentTime() : '';
    const logoutTime = actionType === 'punchout' ? getCurrentTime() : '';
    
    const body = {
      login_time: loginTime,
      lat: location.latitude,
      longt: location.longitude,
      image: image,
      date: getCurrentDate(),
      logout_time: logoutTime,
    };

    console.log('Punching:', body);

    try {
      const response = await axios.post(`https://crpch.in/api/ka/student/punchin_punchout/?id=${id}`, body, {
        headers: {
          'Authorization': `Token ${Token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(`${actionType === 'punchin' ? 'Punch In' : 'Punch Out'} successful`);
        setSnackbarSeverity('success');

        if(actionType === 'punchout') {
          setDisablePunchOut(true);
          setEnablePunchOut(false);
        }
        else if(actionType === 'punchin') {
          Cookies.set('punchedIn', true, { expires: 10 / 24 });  // 10 hours
            setEnablePunchOut(true);
            setDisablePunchIn(true);
        }

      } else {
        setSnackbarMessage('Error occurred while punching');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Failed to communicate with server');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true);
  };

  const handlePunchOut = async (actionType) => {

    if(!location.latitude && !location.longitude) {
        setSnackbarMessage('Location not available');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    if(!image) {
        setSnackbarMessage('Please capture an image');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    const loginTime = actionType === 'punchin' ? getCurrentTime() : '';
    const logoutTime = actionType === 'punchout' ? getCurrentTime() : '';
    
    const body = {
      login_time: loginTime,
      lat: location.latitude,
      longt: location.longitude,
      image: image,
      date: getCurrentDate(),
      logout_time: logoutTime,
    };

    console.log('Punching:', body);

    try {
      const response = await axios.post(`https://crpch.in/api/ka/student/punchout/?id=${id}`, body, {
        headers: {
          'Authorization': `Token ${Token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(`${actionType === 'punchin' ? 'Punch In' : 'Punch Out'} successful`);
        setSnackbarSeverity('success');

        if(actionType === 'punchout') {
          Cookies.set('punchedOut', true, { expires: 10 / 24 });
          setDisablePunchOut(true);
          setEnablePunchOut(false);
        }
        else if(actionType === 'punchin') {
            setEnablePunchOut(true);
        }

      } else {
        setSnackbarMessage('Error occurred while punching');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Failed to communicate with server');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true);
  };

  // Countdown logic for break
  // useEffect(() => {
  //   let interval;
  //   if (countdown > 0) {
  //     interval = setInterval(() => {
  //       setCountdown(prevCountdown => prevCountdown - 1);
  //     }, 1000);
  //   }
  //   if (countdown === 0) {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [countdown]);

  const [isCountdownActive, setIsCountdownActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isCountdownActive && !isBreakPaused && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
        localStorage.setItem('break_time', countdown - 1); // Update localStorage
        console.log('Break Time:', countdown);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(interval);
      setIsBreakDisabled(true); // Disable break button when countdown reaches 0
    }

    return () => clearInterval(interval);
  }, [isCountdownActive, countdown, isBreakPaused]);

  //   useEffect(() => {
  //     let interval;
  //     if (!isBreakPaused && countdown > 0) {
  //         interval = setInterval(() => {
  //             setCountdown(prevCountdown => prevCountdown - 1);
  //             localStorage.setItem('break_time', countdown - 1);  
  //             console.log('Break Time:', countdown);
  //         }, 1000);
  //     }

  //     if (countdown === 0) {
  //         clearInterval(interval);
  //         setIsBreakDisabled(true); 
  //     }

  //     return () => clearInterval(interval);
  // }, [countdown, isBreakPaused]);

  // Format countdown as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Handle break button click (open dialog)
  const handleBreakClick = () => {
    if(!location.latitude && !location.longitude) {
        setSnackbarMessage('Location not available');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    if(!image) {
        setSnackbarMessage('Please capture an image');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }
    // setCountdown(break_time);
    setIsBreakOpen(true);
    setIsCountdownActive(true);
    setIsBreakPaused(false);
  };

  // Stop button handler
  const handleStop = () => {
    // setCountdown(0);
    // setIsBreakOpen(true);
    setIsBreakPaused(true);
  };

  // Close break dialog
  const handleCloseBreak = () => {
    setIsBreakOpen(false);
  };

  return (
    <div className="container mt-4" style={{ filter: isBreakOpen ? 'blur(5px)' : 'none' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Staff Attendance
      </Typography>

      {/* Location display */}
      <Box textAlign="center" mb={3}>
        <Typography variant="body1">
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Typography>
      </Box>

      {/* Capture image button */}
      <Box textAlign="center" mb={3}>
        <Button variant="contained" color="primary" onClick={captureImage}>
          Click Photo
        </Button>
      </Box>

      {/* Display captured image */}
      {image && (
        <Box textAlign="center" mb={3}>
          <img src={image} alt="Captured" width="300px" />
        </Box>
      )}

      {/* Cards Section */}
      <Grid container spacing={3}>
        {/* Punch In Card */}
        <Grid item xs={12} md={4}>
        <Tooltip title={disablePunchIn ? 'Already punched in' : ''}>
          <Card
            sx={{
              backgroundColor: disablePunchIn ? '#a5d6a7' : '#4caf50',
              transition: 'transform 0.3s',
              cursor: disablePunchIn ? 'not-allowed' : 'pointer',
              opacity: disablePunchIn ? 0.5 : 1,
              '&:hover': disablePunchIn ? {} : { transform: 'scale(1.05)' },
            }}
            onClick={disablePunchIn ? null : () => handlePunch('punchin')}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Punch In
              </Typography>
              <Typography variant="body2">
                Mark your attendance for the day by punching in.
              </Typography>
            </CardContent>
          </Card>
          </Tooltip>
        </Grid>

        {/* Punch Out Card */}
        <Grid item xs={12} md={4}>
        <Tooltip title={enablePunchOut && disablePunchOut ? 'Already punched out' : ''}>
          <Card
            sx={{
              backgroundColor: enablePunchOut && !disablePunchOut ? '#f44336' : '#e57373',
              transition: 'transform 0.3s',
            
              cursor: enablePunchOut && !disablePunchOut ? 'pointer' : 'not-allowed',
              opacity: enablePunchOut && !disablePunchOut ? 1 : 0.5,
              
              '&:hover': enablePunchOut && !disablePunchOut ? { transform: 'scale(1.05)' } : {},
              
            }}
            onClick={enablePunchOut && !disablePunchOut ? () => handlePunchOut('punchout') : null}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Punch Out
              </Typography>
              <Typography variant="body2">
                Mark the end of your workday by punching out.
              </Typography>
            </CardContent>
          </Card>
          </Tooltip>
        </Grid>

        {/* Break Card */}
        <Grid item xs={12} md={4}>
        <Tooltip title={isBreakDisabled ? 'Break is not available or Countdown is running' : ''}>
          <Card
            onClick={() => !isBreakDisabled && handleBreakClick()}
            sx={{
              backgroundColor: '#ff9800',
              transition: 'transform 0.3s',
              cursor: isBreakDisabled  ? 'not-allowed' : 'pointer',
              opacity: isBreakDisabled ? 0.5 : 1,
              '&:hover': !isBreakDisabled && {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Break
              </Typography>
              <Typography variant="body2">
                Take a break during your working hours.
              </Typography>
            </CardContent>
          </Card>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Break Countdown Dialog */}
      <Dialog open={isBreakOpen} onClose={handleCloseBreak} fullWidth maxWidth="sm">
        <DialogContent>
          <Box textAlign="center" mt={2}>
            <Typography variant="h4" gutterBottom>
              Break Countdown
            </Typography>
            <Typography variant="h1" color="primary">
              {formatTime(countdown)}
            </Typography>
            {/* <Button variant="contained" color="secondary" onClick={handleStop} sx={{ mt: 3 }}>
              Stop
            </Button> */}
             <Button variant="contained" color="secondary" onClick={handleStop}>
                            Pause
                        </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default StaffAttendance;