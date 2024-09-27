import React, { useState } from 'react';
import { TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function Attendance() {
  const navigate = useNavigate();
  // Initial batch data
  const [batches] = useState([
    { id: 1, batchName: 'Batch A', students: 20 },
    { id: 2, batchName: 'Batch B', students: 15 },
    { id: 3, batchName: 'Batch C', students: 25 },
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered batches based on search query
  const filteredBatches = batches.filter((batch) =>
    batch.batchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAttendance = (batchId) => {
    navigate(`/dashboard/batch-attendance/${batchId}`);
  };

  const handleViewAttendance = (batchId) => {
    navigate(`/dashboard/view-attendance/${batchId}`);
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
                      {batch.batchName}
                    </TableCell>
                    <TableCell align="center">{batch.students}</TableCell>
                    <TableCell align="center">
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleMarkAttendance(batch.batchName)}
                          >
                            Take Attendance
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={() => handleViewAttendance(batch.batchName)}
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
