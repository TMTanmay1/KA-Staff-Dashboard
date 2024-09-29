import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Attendance() {
  const navigate = useNavigate();
  const Token = localStorage.getItem('authToken');
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('https://crpch.in/api/ka/student/batch_total_students/', {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });
        setBatches(response.data.table_data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);





  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered batches based on search query
  const filteredBatches = batches.filter((batch) =>
    batch.batch_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAttendance = (batchId) => {
    navigate(`/dashboard/batch-attendance/${batchId}`);
  };

  const handleViewAttendance = (batchId) => {
    navigate(`/dashboard/view-attendance/${batchId}`, );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Heading */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'left', marginBottom: 2 }}>
            Batch Attendance
          </Typography>
        </Grid>

        {/* Search Bar */}
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="Search Batch" 
            variant="outlined" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            sx={{ marginBottom: 3 }} 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Batch Details Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="batch details table" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                  <TableCell align="center">Batch Name</TableCell>
                  <TableCell align="center">No. of Students</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell align="center" component="th" scope="row">
                      {batch.batch_name}
                    </TableCell>
                    <TableCell align="center">{batch.no_of_students}</TableCell>
                    <TableCell align="center">
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleMarkAttendance(batch.id)}
                          >
                            Take Attendance
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={() => handleViewAttendance(batch.id)}
                          >
                            View Attendance
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Attendance;
