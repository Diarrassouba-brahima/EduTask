import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div>
      {user.role === 'student' ? (
        <StudentDashboard />
      ) : (
        <TeacherDashboard />
      )}
    </div>
  );
};

export default Dashboard;