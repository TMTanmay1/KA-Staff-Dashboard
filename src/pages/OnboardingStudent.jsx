import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box, Dialog, DialogActions, DialogContent, Slide, MenuItem, Select, FormControl, InputLabel ,Snackbar,
  Alert,} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import cnf from '../assets/cnf.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OnboardingStudent() {
  const location = useLocation();
  const studentData = location.state?.student;
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [selectBatch, setSelectBatch] = useState('');
  const [selectCourse, setSelectCourse] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [courseAmount, setCourseAmount] = useState('');
  const [password, setPassword] = useState('');
  const [batches, setBatches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const Token = localStorage.getItem('authToken');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  useEffect(() => {
    if (studentData?.COURSE?.id) {
      fetchBatches(studentData.COURSE.id);
    }
  }, [studentData]);

  const fetchBatches = async (courseId) => {
    try {
      const response = await axios.get(`https://crpch.in/api/ka/course-batch/?course_id=${courseId}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });
      setBatches(response.data.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  useEffect(() => {
    if (studentData) {
      setStudentName(studentData.name || '');
      setSelectBatch(''); // This should be updated based on existing data if applicable
      setSelectCourse(studentData.COURSE.COURSE_name || '');
      setPaidAmount(''); // You can set this according to your logic
      setDueAmount(''); // You can set this according to your logic
      setCourseAmount(studentData.COURSE.COURSE_fee || '');
    }
  }, [studentData]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmCancel = () => {
    handleCloseDialog();
    setSelectBatch('');
    setPaidAmount('');
    setDueAmount('');
  };


  console.log(selectBatch,studentData.COURSE.id,paidAmount,dueAmount,password );
  

  const handleSubmit = async () => {
    try {
      await axios.put(`https://crpch.in/api/ka/student/?id=${studentData.id}`, {
        BATCH: selectBatch,
        COURSE: studentData.COURSE.id,
        paid_amount: paidAmount,
        due_amount: dueAmount,
        password: password,
      }, {
        headers: {
          Authorization: `Token ${Token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setSnackbarMessage('Student onboarded successfully');
      setSnackbarSeverity('success');
      navigate('/dashboard/registered-students'); 
      
    } catch (error) {
      console.error('Error updating student data:', error);
      setSnackbarMessage('Student Onboarding Failed');
      setSnackbarSeverity('error');
    }finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Onboarding Student
      </Typography>

      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          {/* Student Name */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Student Name
            </Typography>
            <TextField
              required
              fullWidth
              id="studentName"
              label="Enter student name"
              variant="outlined"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled
            />
          </Grid>

          {/* Select Batch */}
          {/* <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" gutterBottom>
              Select Batch
            </Typography>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="selectBatchLabel">Select Batch</InputLabel>
              <Select
                labelId="selectBatchLabel"
                id="selectBatch"
                label="Select Batch"
                value={selectBatch}
                onChange={(e) => setSelectBatch(e.target.value)}
              >
                {batches.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.BATCH_name}
                  </MenuItem>
                ))}

              </Select>
            </FormControl>
          </Grid> */}

<Grid item xs={12} sm={6}>
  <Typography variant="subtitle1" gutterBottom>
    Select Batch
  </Typography>
  {batches && batches.length > 0 ? (
    <FormControl fullWidth required variant="outlined">
      <InputLabel id="selectBatchLabel">Select Batch</InputLabel>
      <Select
        labelId="selectBatchLabel"
        id="selectBatch"
        label="Select Batch"
        value={selectBatch}
        onChange={(e) => setSelectBatch(e.target.value)}
      >
        {batches.map((batch) => (
          <MenuItem key={batch.id} value={batch.id}>
            {batch.BATCH_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Typography variant="subtitle1" gutterBottom>
      No batch for this course
    </Typography>
  )}
</Grid>



          {/* Select Course */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Select Course
            </Typography>
            <TextField
              required
              fullWidth
              id="selectCourse"
              label="Enter course"
              variant="outlined"
              value={selectCourse}
              onChange={(e) => setSelectCourse(e.target.value)}
              disabled
            />
          </Grid>

          {/* Paid Amount */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Paid Amount
            </Typography>
            <TextField
              required
              fullWidth
              id="paidAmount"
              label="Enter paid amount"
              variant="outlined"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </Grid>

          {/* Due Amount */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Due Amount
            </Typography>
            <TextField
              required
              fullWidth
              id="dueAmount"
              label="Enter due amount"
              variant="outlined"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
            />
          </Grid>

          {/* Course Amount */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Course Amount
            </Typography>
            <TextField
              required
              fullWidth
              id="courseAmount"
              label="Enter course amount"
              variant="outlined"
              value={courseAmount}
              onChange={(e) => setCourseAmount(e.target.value)}
              disabled
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Password
            </Typography>
            <TextField
              required
              fullWidth
              id="password"
              label="Enter password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            </Grid>

        {/* Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={handleOpenDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </form>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        maxWidth="sm"
        sx={{ borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: 100, height: 'auto' }}>
            <Lottie animationData={cnf} loop={true} />
          </Box>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography>Are you sure you want to cancel?</Typography>
          </DialogContent>
        </Box>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleCloseDialog} color="error">No</Button>
          <Button onClick={handleConfirmCancel} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

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

export default OnboardingStudent;
