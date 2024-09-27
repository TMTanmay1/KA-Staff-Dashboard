import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Box , 
  Snackbar,
  Alert,} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddFee() {
  const navigate = useNavigate();
  const Token = localStorage.getItem('authToken');
  const location = useLocation();
  const studentData = location.state?.student;

  const[monthlyFeeAmount, setMonthlyFeeAmount] = useState('');
  // const[ofMonth, setOfMonth] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (studentData) {
      setMonthlyFeeAmount('');
    }
  }, [studentData]);

  const handleAddFee = async () => {
    console.log(studentData.id, monthlyFeeAmount);
    
    try {
      const response = await axios.put(`https://crpch.in/api/ka/monthly-fee-update/?id=${studentData.id}`, {
        paid_amount: monthlyFeeAmount,
      }, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      setSnackbarMessage('Fee added successfully');
      setSnackbarSeverity('success');

      navigate('/dashboard/registered-students'); 
    } catch (error) {
      console.error('Error adding fee:', error);

      setSnackbarMessage('Failed to add fee');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  }


  return (
    <Box 
      sx={{ 
        padding: '20px', 
        maxWidth: '600px', 
        margin: 'auto',
      }}
    >
      {/* Left aligned heading */}
      <Typography 
        variant="h4" 
        align="left" 
        style={{ marginBottom: '20px' }}
      >
        Add Fees
      </Typography>

      <Grid container spacing={2}>
        {/* Student Name with full width */}
        <Grid item xs={12}>
          <TextField
            label="Student Name"
            required
            variant="outlined"
            fullWidth
            value={studentData?.name}
            disabled
          />
        </Grid>

        {/* Belonging Batch and Belonging Course horizontally aligned */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Belonging Batch"
            required
            variant="outlined"
            fullWidth
            value={studentData?.BATCH.BATCH_name}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Belonging Course"
            required
            variant="outlined"
            fullWidth
            value={studentData?.COURSE.COURSE_name}
            disabled
          />
        </Grid>

        {/* Paid Amount and Due Amount horizontally aligned */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Paid Amount"
            required
            variant="outlined"
            fullWidth
            value={studentData?.total_paid_amount}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Due Amount"
            required
            variant="outlined"
            fullWidth
            value={studentData?.COURSE.COURSE_fee - studentData?.total_paid_amount}
            disabled
          />
        </Grid>

        {/* Course Amount */}
        <Grid item xs={12}>
          <TextField
            label="Course Amount"
            required
            variant="outlined"
            fullWidth
            value={studentData?.COURSE.COURSE_fee}
            disabled
          />
        </Grid>

        {/* Monthly Fee Amount and Of Month horizontally aligned */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Monthly Fee Amount"
            required
            variant="outlined"
            fullWidth
            value={monthlyFeeAmount}
            onChange={(e) => setMonthlyFeeAmount(e.target.value)}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <TextField
            label="Of Month"
            required
            variant="outlined"
            fullWidth
            value={ofMonth}
            onChange={(e) => setOfMonth(e.target.value)}
          />
        </Grid> */}
      </Grid>

      {/* Buttons aligned at the bottom */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '20px' 
        }}
      >
        <Button 
          variant="outlined" 
          color="secondary"
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddFee}
        >
          Save
        </Button>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddFee;
