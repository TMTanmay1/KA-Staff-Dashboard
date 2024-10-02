import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddFee from './AddFee';

const RegisteredStudents = () => {
  const Token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentsData, setStudentsData] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchRegisteredStudents = async () => {
      try {
        const response = await axios.get('https://crpch.in/api/ka/registered_student/',{
          headers: {
            Authorization: `Token ${Token}`,
          },
        });
        setStudentsData(response.data.table_data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegisteredStudents();
  }, []);


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

  const handleMenuClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleAddFee = () => {
    navigate('/dashboard/add-fee' , { state: { student: selectedStudent } });
    handleMenuClose();
  };

  const handleViewLedger = () => {
    navigate('/dashboard/view-ledger' , { state: { student: selectedStudent } });
    handleMenuClose();
  };

  const handleViewProfile = () => {
    navigate('/dashboard/view-profile' , { state: { student: selectedStudent } }); // Navigate to ViewStudent page
    handleMenuClose();
  };

  const handleDeleteRegistration = async (id) => {
    try {
      const response = await axios.delete(`https://crpch.in/api/ka/registered_student/?id=${id}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      
      setSnackbarMessage('Student registration deleted successfully');
      setSnackbarSeverity('success');
      setStudentsData(studentsData.filter((student) => student.id !== id));
    } catch (error) {   
      console.error('Error deleting student registration:', error);
      setSnackbarMessage('Failed to delete student registration');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };


  const handleUpdateStudentStatus = async (id, isDropout, isPassout) => {

    console.log('isDropout:', isDropout);
    console.log('isPassout:', isPassout);
    console.log('id:', id);
    try {
      const response = await axios.get(
        `https://crpch.in/api/ka/student_status/?student_id=${id}&active=${'False'}&pass=${isPassout}&drop=${isDropout}`,
        {
          headers: {
            Authorization: `Token ${Token}`,
          },
        }
      );
      
      setSnackbarMessage(
        isDropout ? 'Student marked as Dropout' : 'Student marked as Passout'
      );
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error updating student status:', error);
      setSnackbarMessage('Failed to update student status');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };
  

  const filteredStudentsData = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div">
              Registered Students
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Typography variant="h6" component="div">
              Total Students: {studentsData.length}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search Students"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth={!(window.innerWidth > 600)}
          sx={{ mb: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Name</TableCell>
              <TableCell align='center'>Batch</TableCell>
              <TableCell align='center'>Course</TableCell>
              <TableCell align='center'>Pending Fees</TableCell>
              <TableCell align='center'>Mobile No</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudentsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student) => (
                <TableRow key={student.id}>
                  <TableCell align='center'>{student.name}</TableCell>
                  {/* <TableCell align='center'>{student.BATCH.BATCH_name}</TableCell> */}
                  <TableCell align='center'>{student.BATCH.BATCH_name ? student.BATCH.BATCH_name : 'Batch not registered'}</TableCell>
                  <TableCell align='center'>{
                    student.COURSE.COURSE_name ? student.COURSE.COURSE_name : 'Course not registered'
                    }</TableCell>
                  <TableCell align='center'>{student.COURSE.COURSE_fee - student.total_paid_amount}</TableCell>
                  <TableCell align='center'>{student.mobile_no}</TableCell>
                  <TableCell align='center'>
                    <IconButton
                      onClick={(event) => handleMenuClick(event, student)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedStudent?.id === student.id}
                      onClose={handleMenuClose}
                    >
                      {/* <MenuItem onClick={handleViewProfile}>View</MenuItem> */}
                      <MenuItem onClick={handleAddFee}>Add Fee</MenuItem>
                      <MenuItem onClick={handleViewLedger}>View Ledger</MenuItem>
                      {/* <MenuItem onClick={handleMenuClose}>Mark Dropout</MenuItem> */}
                      <MenuItem
                        onClick={() => {
                          handleUpdateStudentStatus(student.id, 'True', 'False'); // Mark as Dropout
                          handleMenuClose();
                        }}
                      >
                        Mark Dropout
                      </MenuItem>
                      {/* <MenuItem onClick={handleMenuClose}>Mark Passout</MenuItem> */}
                      
                      <MenuItem
  onClick={() => {
    handleUpdateStudentStatus(student.id, 'False', 'True'); // Mark as Passout
    handleMenuClose();
  }}
>
  Mark Passout
</MenuItem>
                      <MenuItem  onClick={() => {
                          handleDeleteRegistration(student.id); // Call delete when clicked
                          handleMenuClose(); // Close the menu after the action
                        }}>Delete</MenuItem>
                      
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudentsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisteredStudents;
