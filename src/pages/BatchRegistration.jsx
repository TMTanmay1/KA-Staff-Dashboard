import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Fade,
  Backdrop,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// AddBatchModal Component
const AddBatchModal = ({ open, onClose, onSubmit ,courses}) => {
  console.log(courses);
  
  const [batchName, setBatchName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleSubmit = () => {
    if (batchName && startDate && endDate) {
      onSubmit({
        batchName,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        course: selectedCourse,
      });
      setBatchName('');
      setStartDate(null);
      setEndDate(null);
      setSelectedCourse('');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Add Batch Details</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <Box mt={3}>
            <TextField
              label="Batch Name"
              variant="outlined"
              fullWidth
              required
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              sx={{ mb: 3 }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
              <InputLabel id="course-label">Select Course</InputLabel>
              <Select
                labelId="course-label"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                label="Select Course"
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.COURSE_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={onClose}>
                Discard
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// EditBatchDialog Component
const EditBatchDialog = ({ open, onClose, onSubmit, batch }) => {
  const [batchName, setBatchName] = useState(batch.batchName);
  const [startDate, setStartDate] = useState(dayjs(batch.startDate));
  const [endDate, setEndDate] = useState(dayjs(batch.endDate));

  const handleUpdate = () => {
    if (batchName && startDate && endDate) {
      onSubmit({
        id: batch.id,
        batchName,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Batch Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Batch Name"
          variant="outlined"
          fullWidth
          required
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          sx={{ mb: 3, mt: 1 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main BatchRegistration Component
const BatchRegistration = () => {
  const Token = localStorage.getItem('authToken');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [courses, setCourses] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  useEffect(() => {
    // Fetch batches from the API
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/batch/`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });
        setBatchData(response.data.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    // Fetch courses from the API
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/course/`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });
        setCourses(response.data.table_data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
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

  const handleAddBatch = async(batch) => {
    console.log(batch);
    
    try {
      // Make API request to add a new batch
      const response = await axios.post(`https://crpch.in/api/ka/batch/`,
        {
          BATCH_name: batch.batchName,
          start_date: batch.startDate,
          end_date: batch.endDate,
          COURSE: batch.course,
        }
        , {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      setModalOpen(false);
      setSnackbarMessage('Batch added successfully!');
      setSnackbarSeverity('success');

    } catch (error) {
      console.error('Error adding batch:', error);
      setSnackbarMessage('Failed to add batch.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

    // to update the course categories list
    useEffect(() => {
      const updateBatchList = async () => {
        try {
          const response = await axios.get(`https://crpch.in/api/ka/batch/`, {
            headers: {
              Authorization: `Token ${Token}`,
            },
          });
  
          setCourseCategories(response.data.table_data);
        } catch (error) {
          console.error('Error fetching course categories:', error);
        }
      };
  
      updateBatchList();
    }, [snackbarOpen]);

  const handleDeleteBatch = async(id) => {
    try{
      const response = await axios.delete(`https://crpch.in/api/ka/batch/?id=${id}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      setSnackbarMessage('Batch deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      const updatedBatches = batchData.filter((batch) => batch.id !== id);
      setBatchData(updatedBatches);
      
    } catch (error) {
      console.error('Error deleting batch:', error);
      setSnackbarMessage('Failed to delete batch.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // useEffect(() => {
  //   const updateBatchList = async () => {
  //     try {
  //       const response = await axios.get(`https://crpch.in/api/ka/batch/`, {
  //         headers: {
  //           Authorization: `Token ${Token}`,
  //         },
  //       });

  //       setBatchData(response.data.table_data);
  //     } catch (error) {
  //       console.error('Error fetching batches:', error);
  //     }
  //   };

  //   updateBatchList();
  // }, [snackbarOpen]);


  const handleEditBatch = (batch) => {
    setCurrentBatch(batch);
    setEditDialogOpen(true);
  };

  const handleUpdateBatch = (updatedBatch) => {
    const updatedBatches = batchData.map((batch) =>
      batch.id === updatedBatch.id ? updatedBatch : batch
    );
    setBatchData(updatedBatches);
  };

  const filteredBatchData = batchData.filter((batch) =>
    batch.BATCH_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div">
              Batch Registration
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(true)}
              fullWidth={!(window.innerWidth > 600)}
            >
              + Add Batch
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search Batches"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Batch Name</TableCell>
              <TableCell align='center'>Course</TableCell>
              <TableCell align='center'>Start Date</TableCell>
              <TableCell align='center'>End Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBatchData.length > 0 ? (
              filteredBatchData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell align='center'>{batch.BATCH_name}</TableCell>
                    <TableCell align='center'>{batch.COURSE.COURSE_name}</TableCell>
                    <TableCell align='center'>{batch.start_date}</TableCell>
                    <TableCell align='center'>{batch.end_date}</TableCell>
                    <TableCell align="center">
                      {/* <IconButton onClick={() => handleEditBatch(batch)}>
                        <EditIcon color="primary" />
                      </IconButton> */}
                      <IconButton onClick={() => handleDeleteBatch(batch.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No batches found.
                  </TableCell>
                </TableRow>
              )}

          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBatchData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddBatch} courses={courses}/>
      {currentBatch && (
        <EditBatchDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleUpdateBatch}
          batch={currentBatch}
        />
      )}
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

export default BatchRegistration;
