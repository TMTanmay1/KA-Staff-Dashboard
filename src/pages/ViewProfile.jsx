import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, Button, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewProfile = () => {
  const Token = localStorage.getItem('authToken');
  const location = useLocation();
  const navigate = useNavigate();
  const studentId =  localStorage.getItem('id') || "7b0ef805-de8f-43ab-a569-c7c79e8d77f6";

  const [studentData, setStudentData] = useState(null);

  // Fetch student profile data using API call
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await axios.get(`https://crpch.in/api/ka/staff/profile/?id=${studentId}`, {
          headers: {
            'Authorization': `Token ${Token}`
          }
        });
        
        if (response.data.status) {
          setStudentData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (studentId) {
      fetchStudentProfile();
    }
  }, [studentId, Token]);



  if (!studentData) {
    return <Typography>Loading...</Typography>; // Loader while fetching data
  }

  const {
    staff_name, email, mobile_no, address, staff_image, staff_unique_ids, 
    BATCH, COURSE, start_date, end_date, gender, dob , password
  } = studentData;

  // Handle multiple or single courses
  const courses = Array.isArray(COURSE) ? COURSE : [COURSE];
  // Handle multiple or single batches
  const batches = Array.isArray(BATCH) ? BATCH : [BATCH];

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: 900, mx: "auto", p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          {/* Profile Photo */}
          <Avatar
            // alt={name}
            src={`https://crpch.in${staff_image}`}
            sx={{
              width: 150,
              height: 150,
              border: "4px solid #1976d2",
              boxShadow: 3,
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom align="center">
          Staff Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Details */}
          <Grid item xs={12} sm={6}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Basic Details
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Staff ID:</strong> {staff_unique_ids}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Name:</strong> {staff_name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Email:</strong> {email || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Contact:</strong> {mobile_no}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Address:</strong> {address}
              </Typography>
              {/* <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Date of Birth:</strong> {dob}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Gender:</strong> {gender}
              </Typography> */}
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Password:</strong> {password}
              </Typography>

            </CardContent>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 4 }} justifyContent="center">
          {/* <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              sx={{
                px: 4,
                py: 1,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Edit Profile
            </Button>
          </Grid> */}
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)} // Go back to the previous page
              sx={{
                px: 4,
                py: 1,
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": { borderColor: "#115293" },
              }}
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ViewProfile;
