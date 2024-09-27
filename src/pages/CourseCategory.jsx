import React, { useState, useEffect } from 'react';
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
  Modal,
  Fade,
  Backdrop,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import constant from '../constant';

const AddCourseCategoryModal = ({ open, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = () => {
    onSubmit(categoryName);
    setCategoryName('');
    onClose();
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
          maxWidth="sm"
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            mt: '10%',
            mx: 'auto',
            position: 'relative',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Course Category
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Course Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="outlined" onClick={onClose}>
                Discard
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

const CourseCategory = () => {
  const Token = localStorage.getItem('authToken');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseCategories, setCourseCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchCourseCategories = async () => {
      try {
        // Make API request to get all course categories
        const response = await axios.get(`https://crpch.in/api/ka/course/category/`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });

        setCourseCategories(response.data.table_data);
      } catch (error) {
        console.error('Error fetching course categories:', error);
      }
    };

    fetchCourseCategories();
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

  const handleAddCategory = async (categoryName) => {
    try {
    
      const response = await axios.post(
        `https://crpch.in/api/ka/course/category/`,
        { COURSE_category: categoryName },
        {
          headers: {
            Authorization: `Token ${Token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      setSnackbarMessage('Category added successfully!');
      setSnackbarSeverity('success');
      
    } catch (error) {
      console.error('Error adding course category:', error);
      setSnackbarMessage('Failed to add category.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // to update the course categories list
  useEffect(() => {
    const fetchCourseCategories = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/course/category/`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });

        setCourseCategories(response.data.table_data);
      } catch (error) {
        console.error('Error fetching course categories:', error);
      }
    };

    fetchCourseCategories();
  }, [snackbarOpen]);

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`https://crpch.in/api/ka/course/category/?id=${categoryId}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      setSnackbarMessage('Category deleted successfully!');
      setSnackbarSeverity('success');

      const updatedCategories = courseCategories.filter(
        (category) => category.id !== categoryId
      );
      setCourseCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting course category:', error);
      setSnackbarMessage('Failed to delete category.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };
  
  const filteredCategories = courseCategories.filter((category) =>
    category.COURSE_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="div">
              Course Categories
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={() => setModalOpen(true)}
              fullWidth={!(window.innerWidth > 600)}
            >
              + Add Course Category
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box my={2}>
        <Typography variant="subtitle1">
          Total Course Categories: {courseCategories.length}
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search Course Category"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
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
              <TableCell align='center'>Category Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell align='center'>{category.COURSE_category}</TableCell>
                    <TableCell align='center'>
                      {/* <IconButton>
                        <EditIcon color="primary" />
                      </IconButton> */}
                      <IconButton onClick={() => handleDeleteCategory(category.id)}>
                        <DeleteIcon color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  No course categories found.
                </TableCell>
              </TableRow>
            )}
            
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AddCourseCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseCategory;
