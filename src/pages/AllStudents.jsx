import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const AllStudents = () => {
  const Token = localStorage.getItem('authToken');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Fetch students based on status filter
  const fetchStudents = async (status = '') => {
    try {
      const url = status ? `https://crpch.in/api/ka/all_student/?type=${status}` : 'https://crpch.in/api/ka/all_student/';
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      if (response.status === 200) {
        setStudents(response.data.data);
        setSnackbarMessage(`${status ? status : 'All'} students fetched successfully`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to fetch data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to fetch data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [Token]);

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
    fetchStudents(status);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6} container alignItems="center">
            <Typography variant="h4">List of all Students</Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select value={filterStatus} onChange={handleFilterChange} label="Status Filter">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="passout">Passout</MenuItem>
                <MenuItem value="dropout">Dropout</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <TextField
        variant="outlined"
        label="Search Student"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Batch Name</TableCell>
              <TableCell align="center">Course Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Mobile No.</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student.id}>
                    <TableCell align="center">{
                      student.name? student.name : "Name not registered"
                      }</TableCell>
                    <TableCell align="center">
  {student.BATCH ? student.BATCH.BATCH_name : "Batch not registered"}
</TableCell>

                    <TableCell align="center">{
                      student.COURSE ? student.COURSE.course_name : "Course not registered"
                      }</TableCell>
                    <TableCell align="center">{student.gender}</TableCell>
                    <TableCell align="center">{student.mobile_no}</TableCell>
                    <TableCell align="center">
                      {student.passout_student ? 'Passout' : student.dropout_student ? 'Dropout' : 'Active'}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AllStudents;
