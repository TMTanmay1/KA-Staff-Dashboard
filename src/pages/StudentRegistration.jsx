import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Container,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import L from '../assets/sr.webp';
import { useNavigate } from 'react-router-dom';

const StudentRegistration = () => {
  const Token = localStorage.getItem('authToken');
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [signature, setSignature] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [duration, setDuration] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [category, setCategory] = useState('');
  const [religion, setReligion] = useState('');
  const [qualification, setQualification] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

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

  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    const selectedCourseObj = courses.find((course) => course.id === selectedId);

    // Set both course ID and its duration
    if (selectedCourseObj) {
      setSelectedCourse(selectedCourseObj.id); // Only store the ID in selectedCourse
      setDuration(Number(selectedCourseObj.COURSE_duration)); // Store duration as a number
    }
  };

  const [p, setP] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
      setP(file);
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(p , "p");

  const [d, setD] = useState(null);
  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    setD(file);
    if (file) {
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocument(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(d , "d");

  const [s, setS] = useState(null);
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    setS(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(s , "s");

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    setDocumentName('');
  };

  const handleRemoveSignature = () => {
    setSignature(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      name: name,
      mobile_no: mobile,
      gender: gender,
      material_status: maritalStatus,
      father_name: fatherName,
      mother_name: motherName,
      dob: dob,
      category: category,
      religion: religion,
      qualification: qualification,
      address: address,
      village: village,
      state: state,
      district: district,
      city: city,
      pincode: pincode,
      COURSE_duration: duration,
      COURSE: selectedCourse,
      // Add photo, document, and signature if required
      student_photo: p,
      student_document: d,
      student_sign: s,
      password:''
    };

    console.log('Payload:', payload);
    

    try {
      await axios.post('https://crpch.in/api/ka/student/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${Token}`,
        },
      });
      
      setSnackbarMessage('Student registered successfully!');
      setSnackbarSeverity('success');

      navigate('/dashboard/applied-student');

    } catch (error) {
      console.error('Error registering student:', error);
      setSnackbarMessage('Failed to register student.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };
  

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem'}}>
       <Box
      width="100%"
      height="150px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="white"
      mb={4}
      style={{
        backgroundImage: `url(${L})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography variant="h4" color='black'>Student Registration</Typography>
    </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

           {/* Course */}
           <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="course-label">Course</InputLabel>
              <Select labelId="course-label" id="course" value={selectedCourse} onChange={handleCourseChange} required>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.COURSE_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Duration */}
          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select labelId="duration-label" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <MenuItem value="6">6 Months</MenuItem>
                <MenuItem value="12">12 Months</MenuItem>
                <MenuItem value="24">24 Months</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}

<Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Duration"
          value={duration ? `${duration} Months` : ""}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField required id="name" label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)}/>
          </Grid>

          {/* Mobile no */}
          <Grid item xs={12} sm={6}>
            <TextField required id="mobile" label="Mobile No" fullWidth value={mobile} onChange={(e) => setMobile(e.target.value)}/>
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select labelId="gender-label" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Marital Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="marital-status-label">Marital Status</InputLabel>
              <Select labelId="marital-status-label" id="marital-status" 
              
              value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <MenuItem value="Unmarried">Unmarried</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField required id="father-name" label="Father's Name" fullWidth value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
          </Grid>

          {/* Mother Name */}
          <Grid item xs={12} sm={6}>
            <TextField required id="mother-name" label="Mother's Name" fullWidth value={motherName} onChange={(e) => setMotherName(e.target.value)} />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12} sm={6}>
            <TextField
              id="dob"
              label="Date of Birth"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select labelId="category-label" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="OBC">OBC</MenuItem>
                <MenuItem value="SC">SC</MenuItem>
                <MenuItem value="ST">ST</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Religion */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="religion-label">Religion</InputLabel>
              <Select labelId="religion-label" id="religion" value={religion} onChange={(e) => setReligion(e.target.value)}>
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Qualification */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="qualification-label">Qualification</InputLabel>
              <Select labelId="qualification-label" id="qualification" value={qualification} onChange={(e) => setQualification(e.target.value)}>
                <MenuItem value="10th">10th</MenuItem>
                <MenuItem value="12th">12th</MenuItem>
                <MenuItem value="Graduation">Graduation</MenuItem>
                <MenuItem value="Post-Graduation">Post-Graduation</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField required id="address" label="Address" multiline rows={4} fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
          </Grid>

          {/* Village */}
          <Grid item xs={12} sm={6}>
            <TextField required id="village" label="Village" fullWidth value={village} onChange={(e) => setVillage(e.target.value)} />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6}>
            <TextField required id="state" label="State" fullWidth value={state} onChange={(e) => setState(e.target.value)} />
          </Grid>

          {/* District */}
          <Grid item xs={12} sm={6}>
            <TextField required id="district" label="District" fullWidth value={district} onChange={(e) => setDistrict(e.target.value)} />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField required id="city" label="City" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={6}>
            <TextField required id="pincode" label="Pincode" fullWidth value={pincode} onChange={(e) => setPincode(e.target.value)} />
          </Grid>

          {/* Student Photo */}
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Student Photo
              <input type="file" hidden onChange={handlePhotoUpload} />
            </Button>
          </Grid>

          {/* Photo Preview and Remove Button */}
          {photo && (
            <Grid item xs={12} sm={6}>
              <small>Preview Photo</small>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <img
                  src={photo}
                  alt="Student"
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <IconButton
                  aria-label="remove photo"
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={handleRemovePhoto}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          )}

          {/* Document Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Document
              <input type="file" hidden onChange={handleDocumentUpload} />
            </Button>
          </Grid>

          {/* Document Preview and Remove Button */}
          {document && (
            <Grid item xs={12} sm={6}>
              <small>Preview Document</small>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <Typography variant="body1">{documentName}</Typography>
                <img
                  src={document}
                  alt="Document"
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <IconButton
                  aria-label="remove document"
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={handleRemoveDocument}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          )}

          {/* Signature Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Signature
              <input type="file" hidden onChange={handleSignatureUpload} />
            </Button>
          </Grid>

          {/* Signature Preview and Remove Button */}
          {signature && (
            <Grid item xs={12} sm={6}>
              <small>Preview Signature</small>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <img
                  src={signature}
                  alt="Signature"
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <IconButton
                  aria-label="remove signature"
                  style={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={handleRemoveSignature}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
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

export default StudentRegistration;
