import React, { useState, useEffect } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Grid,
  useMediaQuery,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Snackbar,
  Alert,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const StudyMaterial = () => {
  const Token = localStorage.getItem('authToken');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [courses, setCourses] = useState([]);
  const studentId =  localStorage.getItem('id') || "7b0ef805-de8f-43ab-a569-c7c79e8d77f6";

  useEffect(() => {
   
    const fetchStudyMaterials = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/study_material/?student_id=${studentId}`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });
        if (response.data.status) {
          // Map the response data to match the structure expected in the table
          const formattedData = response.data.table_data.map((material) => ({
            id: material.id,
            course: material.COURSE.COURSE_name,
            description: material.file_description,
            files: material.file ? [{ name: material.file.split('/').pop(), url: material.file }] : [],
          }));
          setStudyMaterials(formattedData);
        } else {
          console.error('Failed to fetch study materials');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudyMaterials();
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

  const filteredStudyMaterials = studyMaterials.filter((material) =>
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStudyMaterial = async (id) => {
    try {
      const response = await axios.delete(`https://crpch.in/api/ka/study_material/?id=${id}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      });

      setSnackbarMessage('Study material deleted successfully');
      setSnackbarSeverity('success');
      setStudyMaterials(studyMaterials.filter((material) => material.id !== id));
    } catch (error) {
      console.error('Error deleting study material:', error);
      setSnackbarMessage('Failed to delete study material');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const downloadFile = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6} container alignItems="center">
            <Typography variant="h4" component="div" gutterBottom>
              Study Materials
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(true)}
              startIcon={<AddIcon />}
              fullWidth={isMobile}
            >
              Add Study Material
            </Button> */}
          </Grid>
        </Grid>
      </Box>

      <TextField
        variant="outlined"
        label="Search Study Material"
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
              <TableCell align='center'>Course</TableCell>
              <TableCell align='center'>Description</TableCell>
              <TableCell align='center'>Files</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudyMaterials.length > 0 ? (
              filteredStudyMaterials
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((material) => (
                  <TableRow key={material.id}>
                    <TableCell align='center'>{material.course}</TableCell>
                    <TableCell align='center'>{material.description}</TableCell>
                    <TableCell align='center'>
                    {material.files.length > 0 ? material.files.map((file, index) => (
                        <a key={index} href={`https://crpch.in${file.url}`} download={file.name} target="_blank" rel="noopener noreferrer">{file.name}</a>
                      )) : 'No files'}
                    </TableCell>
                    <TableCell align='center'>
                    <IconButton onClick={()=>
                      handleDeleteStudyMaterial(material.id)
                    }>
                        <DeleteIcon color='secondary' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  No study materials found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudyMaterials.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudyMaterial;
