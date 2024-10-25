import React, { useState , useEffect} from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ViewAttendance() {
  const { batchId } = useParams();
  const [date, setDate] = useState(''); // Date state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [students, setStudents] = useState([]); // Example students data

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`https://crpch.in/api/ka/student/search_date/?date=${date}&id=${batchId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      setStudents(response.data.table_data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (Id) => {
    try {
      const response = await axios.delete(`https://crpch.in/api/ka/student/take_attendance/?id=${Id}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });

      const updatedStudents = students.filter((student) => student.id !== studentId);

      setSnackbarMessage('Attendance deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('Error deleting attendance:', error);
      setSnackbarMessage('Error deleting attendance');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 3 }}>
        View Attendance
      </Typography>

      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        {/* Search Bar on the Left */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search Student"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Date Picker and View Button on the Right */}
        <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" onClick={fetchStudents}>
            View
          </Button>
        </Grid>
      </Grid>

      {/* Horizontal Line */}
      <hr style={{ margin: '20px 0' }} />

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
              <TableCell align="center">Student Name</TableCell>
              <TableCell align="center">Attendance</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.student.name}</TableCell>
                  <TableCell align="center">{student.attend == true ? 'Present': 'Absent'}</TableCell>
                  <TableCell align="center">
                    <EditIcon color="primary" style={{ cursor: 'pointer', marginRight: '10px' }} />
                    <DeleteIcon color="secondary" style={{ cursor: 'pointer' ,marginRight: '10px' }} 
                    onClick={() => handleDelete(student.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No attendance data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ViewAttendance;
