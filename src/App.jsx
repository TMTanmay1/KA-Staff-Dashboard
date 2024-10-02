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
import AddFee from './pages/AddFee.jsx';
import AllStudents from './pages/AllStudents.jsx';
import AppliedStudent from './pages/AppliedStudent.jsx';
import BatchRegistration from './pages/BatchRegistration.jsx';
import Course from './pages/Course.jsx';
import CourseCategory from './pages/CourseCategory.jsx';
import LedgerPage from './pages/LedgerPage.jsx';
import OnboardingStudent from './pages/OnboardingStudent.jsx';
import RegisteredStudents from './pages/RegisteredStudents.jsx';
import StudentRegistration from './pages/StudentRegistration.jsx';
import StaffAttendace from './pages/StaffAttendace.jsx';

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

          <Route path="/dashboard/batch-registration" element={<BatchRegistration />} />
          <Route path="/dashboard/student-registration" element={<StudentRegistration />} />
          <Route path="/dashboard/manage-course-category" element={<CourseCategory />} />
          <Route path="/dashboard/course" element={<Course />} />
          <Route path="/dashboard/registered-students" element={<RegisteredStudents />} />
          <Route path="/dashboard/applied-student" element={<AppliedStudent />} />
          <Route path="/dashboard/onboarding-student" element={<OnboardingStudent />} />
          <Route path="/dashboard/add-fee" element={<AddFee />} />
          <Route path="/dashboard/view-ledger" element={<LedgerPage />} />
          <Route path="/dashboard/all-students" element={<AllStudents />} />
          <Route path="/dashboard/study-material" element={<StudyMaterial />} />
          <Route path="/dashboard/staff-attendance" element={<StaffAttendace />} />
        </Route>
      </Routes>
      </Router>
    // </ThemeProvider>
  );
}

export default App;
