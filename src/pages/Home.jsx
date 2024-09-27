import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, TablePagination, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';



const cardStyles = [
  {
    backgroundColor: '#ff6f61', // Coral
    color: '#fff',
  },
  {
    backgroundColor: '#6a1b9a', // Deep Purple
    color: '#fff',
  },
  {
    backgroundColor: '#1e88e5', // Blue
    color: '#fff',
  },
  {
    backgroundColor: '#43a047', // Green
    color: '#fff',
  },
];

const Home = () => {
  const Token = localStorage.getItem('authToken');
  const id =  localStorage.getItem('id') || "7b0ef805-de8f-43ab-a569-c7c79e8d77f6";
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sampleData, setSampleData] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    course_fee: 0,
    total_paid: 0,
    drop_out: 0,
    total_due: 0,
    points: 0,
  });


  useEffect(() => {
    console.log(id);
    
    // Fetch batches from the API
    const fetchTask = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/staff/task-assign/?id=${id}`, {
          headers: {
            Authorization: `Token ${Token}`,
          },
        });

        setSampleData(response.data.table_data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchTask();

    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await axios.get(`https://crpch.in/api/ka/student/details/total/?student_id=${id}`, {
    //       headers: {
    //         Authorization: `Token ${Token}`,
    //       },
    //     });
    //     setDashboardData(response.data);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // };

    // fetchDashboardData();
  }, []);



  // Filter data based on search term
  const filteredData = sampleData.filter(row =>
    row.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ px: 0, py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

<Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: cardStyles[0].backgroundColor,
                color: cardStyles[0].color,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                p: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', px: 2, py: 3 }}>
                <Typography variant="h4">{dashboardData.course_fee}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Present 
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: cardStyles[1].backgroundColor,
                color: cardStyles[1].color,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                p: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', px: 2, py: 3 }}>
                <Typography variant="h4">{dashboardData.total_paid}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Absent 
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: cardStyles[2].backgroundColor,
                color: cardStyles[2].color,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                p: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', px: 2, py: 3 }}>
                <Typography variant="h4">{dashboardData.total_due}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Half Day
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: cardStyles[3].backgroundColor,
                color: cardStyles[3].color,
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                p: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', px: 2, py: 3 }}>
                <Typography variant="h4">{dashboardData.points}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Leave
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Table with Search Bar */}
        <Box sx={{ mt: 4, mb: 2, display: 'flex', flexDirection: 'row', sm: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom>
            Task Details
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 300, flexGrow: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton edge="end" sx={{ p: '10px' }}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>

        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 300, maxWidth: '100%' }}>
  <TableHead>
    <TableRow>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Sr. No</TableCell>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Task</TableCell>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Description</TableCell>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Task From</TableCell>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Task To</TableCell>
      <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {filteredData.length > 0 ? (
      filteredData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, index) => (
          <TableRow key={row.id}
            sx={{
              color: row.task_complete ? 'green' : 'red' , // Conditional row text color
            }}
          >
            <TableCell align='center' sx={{ color: 'inherit' }}>{index + 1}</TableCell>
            <TableCell align='center' sx={{ color: 'inherit' }}>{row.task}</TableCell>
            <TableCell align='center' sx={{ color: 'inherit' }}>{row.task_description}</TableCell>
            <TableCell align='center' sx={{ color: 'inherit' }}>{row.task_from }</TableCell>
            <TableCell align='center' sx={{ color: 'inherit' }}>{row.task_to}</TableCell>
            <TableCell align='center'>
              <Button variant="contained" color="primary" size="small">
                Mark As Done
              </Button>
            </TableCell>
          </TableRow>
        ))
    ) : (
      <TableRow>
        <TableCell colSpan={6} align='center'>
          No data found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
