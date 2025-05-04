import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// Assignment Pages
import AssignmentsListPage from './pages/assignments/AssignmentsListPage';
import AssignmentDetailsPage from './pages/assignments/AssignmentDetailsPage';
import CreateAssignmentPage from './pages/assignments/CreateAssignmentPage';

// Submission Pages
import GradeSubmissionPage from './pages/submissions/GradeSubmissionPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Teacher Only Route Component
const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!user || user.role !== 'teacher') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<AssignmentsListPage />} />
            <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
            
            {/* Teacher-only routes */}
            <Route 
              path="/assignments/new" 
              element={
                <TeacherRoute>
                  <CreateAssignmentPage />
                </TeacherRoute>
              } 
            />
            
            <Route 
              path="/grade-submission/:id" 
              element={
                <TeacherRoute>
                  <GradeSubmissionPage />
                </TeacherRoute>
              } 
            />
            
            <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
          </Route>
          
          {/* Redirect to login if not matching */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;