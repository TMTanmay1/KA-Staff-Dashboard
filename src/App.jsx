import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import ViewProfile from './pages/ViewProfile.jsx';
import StudyMaterial from './pages/StudyMaterial.jsx';
import Attendance from './pages/Attendance.jsx';
import BatchAttendance from './pages/BatchAttendance.jsx';
import ViewAttendance from './pages/ViewAttendance.jsx';

function App() {
  return (
    // <ThemeProvider theme={theme}>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard/view-profile" element={<ViewProfile />} />
          <Route path="/dashboard/study-material" element={<StudyMaterial />} />
          <Route path="/dashboard/attendance" element={<Attendance />} />
          <Route path="/dashboard/batch-attendance/:batchId" element={<BatchAttendance />} />
          <Route path="/dashboard/view-attendance/:batchId" element={<ViewAttendance />} />
        </Route>
      </Routes>
      </Router>
    // </ThemeProvider>
  );
}

export default App;
