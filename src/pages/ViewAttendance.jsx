import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function ViewAttendance() {
  const [date, setDate] = useState(''); // Date state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [students] = useState([
    { id: 1, studentName: 'John Doe', attendance: 'Present' },
    { id: 2, studentName: 'Jane Smith', attendance: 'Absent' },
    { id: 3, studentName: 'Michael Brown', attendance: 'Present' },
  ]); // Example students data

  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = () => {
    // Implement the logic for viewing attendance based on the selected date
    console.log('Selected Date:', date);
  };

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
          <Button variant="contained" onClick={handleView}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.studentName}</TableCell>
                  <TableCell align="center">{student.attendance}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  No attendance data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ViewAttendance;
