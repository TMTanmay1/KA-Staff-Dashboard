import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Avatar, Grid, Paper, Card, CardContent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const LedgerPage = () => {
  const [student, setStudent] = useState(null);
  const [ledger, setLedger] = useState([]);
  const location = useLocation();
  const Token = localStorage.getItem('authToken');

  const sData = location.state?.student;
  const studentId = sData.id;

  useEffect(() => {
    if (studentId) {
      axios
        .get(`https://crpch.in/api/ka/ledger/?student_id=${studentId}`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setStudent(response.data.student);  // Set the student details
            setLedger(response.data.ledger);    // Set the ledger entries
          }
        })
        .catch((error) => {
          console.error('Error fetching ledger data:', error);
        });
    }
  }, [studentId, Token]);

  if (!student) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Section with Student Image and Details */}
      <Paper elevation={4} sx={{ padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
        <Avatar
          src={`https://crpch.in${student.student_photo}`}
          alt={student.name}
          sx={{ width: 100, height: 100, marginRight: '20px', border: '2px solid #3f51b5' }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{student.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Batch: {student.BATCH.BATCH_name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Course: {student.COURSE.COURSE_name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Mobile: {student.mobile_no}</Typography>
          <Typography variant="subtitle1" color="textSecondary">DOB: {student.dob}</Typography>
        </Box>
        {/* <Box sx={{ marginLeft: 'auto', textAlign: 'right' }}>
          <Typography variant="h3" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>{student.points}</Typography>
          <Typography variant="body2" color="textSecondary">Total Points</Typography>
        </Box> */}
      </Paper>

      {/* Divider */}
      <Divider sx={{ marginBottom: '30px' }} />

      {/* Ledger Section */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Ledger</Typography>

        {/* Ledger Entries */}
        <Grid container spacing={3}>
        {ledger.length > 0 ? (
            ledger.map((entry) => (
              <Grid item xs={12} md={4} key={entry.id}>
                <Card
  elevation={2}
  sx={{
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f2994a, #f2c94c)', // Orange to yellow gradient
    color: '#ffffff', // White text for better contrast
  }}
>
  <CardContent>
    <Typography variant="body2" sx={{ opacity: 1 }}>
      Transaction Date
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px', color:"black" }}>
      {new Date(entry.payment_date).toLocaleDateString()}
    </Typography>

    <Typography variant="body2" sx={{ opacity: 1 }}>
      Amount
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px', color:"black" }}>
      ₹{entry.payment_amount}
    </Typography>

    <Typography variant="body2" sx={{ opacity: 1 }}>
      Due Amount
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color:"black" }}>
      ₹{entry.due_amount}
    </Typography>
  </CardContent>
</Card>

              </Grid>
            ))
          ) : (
            <Typography>No ledger entries available</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default LedgerPage;
