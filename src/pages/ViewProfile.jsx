import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ViewProfile = () => {
  const Token = localStorage.getItem('authToken');
  const location = useLocation();
  const navigate = useNavigate();
  const studentId =  localStorage.getItem('id') || "7b0ef805-de8f-43ab-a569-c7c79e8d77f6";

  const [studentData, setStudentData] = useState(null);
  const idCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const downloadIDCardPDF = async () => {
    if (!idCardRef.current) {
      console.error("ID Card element not found");
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(idCardRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 180; // adjusted for the new card size
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`${staff_name}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could add a user-facing error message here
    } finally {
      setIsDownloading(false);
    }
  };

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
        <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
              onClick={downloadIDCardPDF}
              disabled={isDownloading}
              sx={{
                px: 4,
                py: 1,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              {isDownloading ? "Downloading..." : "Download ID"}
            </Button>
          </Grid> 

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

      {/* Updated ID Card Design */}
<Box 
  ref={idCardRef} 
  sx={{ 
    position: "absolute",
    left: "-9999px",
    top: 0,
    width: "600px",
    height: "350px",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  }}
>
  <Box
    sx={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #FFD700, #ffffff)", // Updated gradient
      color: "#000", // Changed text color to black
      borderRadius: 4,
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header */}
    <Box sx={{ 
      p: 2, 
      background: "rgba(0, 0, 0, 0.1)", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center"
    }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000" }}>Krishna Academy</Typography> {/* Changed text color */}
      <Typography variant="body2" sx={{ color: "#000" }}>Staff ID Card</Typography> {/* Changed text color */}
    </Box>

    {/* Content */}
    <Box sx={{ display: "flex", p: 3, flexGrow: 1 }}>
      {/* Left side - Photo */}
      <Box sx={{ mr: 3 }}>
        <Avatar
          src={`https://crpch.in${staff_image}`}
          sx={{ width: 120, height: 120, border: "4px solid #fff" }}
        />
      </Box>

      {/* Right side - Details */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#000" }}>{staff_name}</Typography> {/* Changed text color */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: "#000" }}>Reg No:</Typography> {/* Changed text color */}
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>{staff_unique_ids}</Typography> {/* Changed text color */}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: "#000" }}>Contact No:</Typography> {/* Changed text color */}
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>{mobile_no}</Typography> {/* Changed text color */}
          </Grid>
  
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: "#000" }}>Address:</Typography> {/* Changed text color */}
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>{address}</Typography> {/* Changed text color */}
          </Grid>
        </Grid>
      </Box>
    </Box>

    {/* Footer */}
    <Box sx={{ 
      mt: "auto", 
      p: 1, 
      background: "rgba(0, 0, 0, 0.1)", 
      textAlign: "center"
    }}>
      <Typography variant="body2" sx={{ color: "#000" }}>
        This card is the property of Krishna Academy.
      </Typography> {/* Changed text color */}
    </Box>
  </Box>
</Box>

    </Box>
  );
};

export default ViewProfile;
