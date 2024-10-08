import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Grid, Button, Pagination,Snackbar,
  Alert, CircularProgress  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function BatchAttendance() {
  const { batchId } = useParams(); // Get batchName from URL params
  const [students, setStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/student/student_of_batches/?id=${batchId}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
        setStudents(response.data.table_data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  // State to store current date
  const [attendanceDate, setAttendanceDate] = useState('');

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (months are 0-indexed, so +1)
    const year = date.getFullYear(); // Get full year
    return `${day}/${month}/${year}`;
  };

  const handleAttendance = async (studentId, status) => {
    const [month, year] = attendanceDate.split('/').slice(1);
    try {
      setLoading(true);
      const response = await axios.post(`https://crpch.in/api/ka/student/take_attendance/?id=${studentId}`, {
        of_month: month,
        year: year,
        attend: status === 'P',
        leave: status === 'A',
        student_id: studentId,
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        setSnackbarMessage('Attendance marked successfully');
        setSnackbarSeverity('success');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setSnackbarMessage('Failed to mark attendance! try again.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  
  // Get the current date and format it
  useEffect(() => {
    const today = new Date();
    setAttendanceDate(formatDate(today));
  }, []);

  // Filtered students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };


  

  return (
    <Box sx={{ padding: { xs: 2, sm: 3 }, width: '100%', maxWidth: '1200px', margin: 'auto' }}>
      {/* Batch Name */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: 3, 
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } 
        }}
      >
        Attendance
      </Typography>

      {/* Search Bar and Attendance Date */}
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
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
            sx={{ marginBottom: { xs: 2, sm: 0 } }}
          />
        </Grid>

        {/* Attendance Date on the Right */}
        <Grid item xs={12} sm={6} textAlign={{ xs: 'left', sm: 'right' }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            Date: {attendanceDate}
          </Typography>
        </Grid>
      </Grid>

      {/* Horizontal Line */}
      <hr style={{ marginBottom: '20px' }} />

      {/* Student Details Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table aria-label="student details table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
              <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Student Name</TableCell>
              <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Batch Name</TableCell>
              <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredStudents.length > 0 ? (
    filteredStudents
      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
      .map((student) => (
        <TableRow key={student.id}>
          <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            {student.name}
          </TableCell>
          <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            {student.BATCH.BATCH_name}
          </TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', minWidth: { xs: '30px', sm: '40px' }, marginRight: 1 }}
              onClick={() => handleAttendance(student.id, 'A')}
              disabled={loading}
            >
              A
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'green', minWidth: { xs: '30px', sm: '40px' } }}
              onClick={() => handleAttendance(student.id, 'P')}
              disabled={loading}
            >
              P
            </Button>
          </TableCell>
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell align="center" colSpan={3} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, padding: '20px' }}>
        No students found
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(filteredStudents.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ display: 'flex', justifyContent: 'center', padding: 2, fontSize: { xs: '0.8rem', sm: '1rem' } }}
        />
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

export default BatchAttendance;
