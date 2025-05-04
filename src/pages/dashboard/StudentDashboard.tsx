import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { getAssignmentsForStudent, getSubmissionsByStudent } from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';
import { Assignment } from '../../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const allAssignments = getAssignmentsForStudent();
  const mySubmissions = getSubmissionsByStudent(user.id);
  
  // Get IDs of assignments that the student has already submitted
  const submittedAssignmentIds = mySubmissions.map(sub => sub.assignmentId);
  
  // Filter assignments into different categories
  const activeAssignments = allAssignments.filter(assignment => 
    assignment.status === 'active' && !submittedAssignmentIds.includes(assignment.id)
  );
  
  const submittedAssignments = allAssignments.filter(assignment => 
    submittedAssignmentIds.includes(assignment.id)
  );
  
  // Calculate assignments due soon (within 3 days)
  const assignmentsDueSoon = activeAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 3 && diffDays > 0;
  });
  
  // Calculate overdue assignments
  const overdueAssignments = activeAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return dueDate < now;
  });
  
  const handleAssignmentClick = (assignment: Assignment) => {
    navigate(`/assignments/${assignment.id}`);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user.name}!
      </h1>
      
      {/* Assignment summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="py-6">
            <h3 className="text-indigo-800 font-medium mb-1">Active Assignments</h3>
            <p className="text-3xl font-bold text-indigo-600">{activeAssignments.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-6">
            <h3 className="text-amber-800 font-medium mb-1">Due Soon</h3>
            <p className="text-3xl font-bold text-amber-600">{assignmentsDueSoon.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="py-6">
            <h3 className="text-rose-800 font-medium mb-1">Overdue</h3>
            <p className="text-3xl font-bold text-rose-600">{overdueAssignments.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-6">
            <h3 className="text-emerald-800 font-medium mb-1">Submitted</h3>
            <p className="text-3xl font-bold text-emerald-600">{submittedAssignments.length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Assignments due soon */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-amber-500" />
          Due Soon
        </h2>
        
        {assignmentsDueSoon.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              No assignments due soon. Great job staying ahead!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentsDueSoon.map((assignment) => (
              <Card 
                key={assignment.id} 
                hover 
                onClick={() => handleAssignmentClick(assignment)}
                className="border-l-4 border-l-amber-500"
              >
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      Due Soon
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Overdue assignments */}
      {overdueAssignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-2 text-rose-500" />
            Overdue
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueAssignments.map((assignment) => (
              <Card 
                key={assignment.id} 
                hover 
                onClick={() => handleAssignmentClick(assignment)}
                className="border-l-4 border-l-rose-500"
              >
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-rose-600 mt-1">
                        Due date passed {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full">
                      Overdue
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Recently submitted */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle size={20} className="mr-2 text-emerald-500" />
          Recently Submitted
        </h2>
        
        {submittedAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              You haven't submitted any assignments yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submittedAssignments.slice(0, 4).map((assignment) => {
              const submission = mySubmissions.find(sub => sub.assignmentId === assignment.id);
              return (
                <Card 
                  key={assignment.id} 
                  hover 
                  onClick={() => handleAssignmentClick(assignment)}
                  className="border-l-4 border-l-emerald-500"
                >
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted {formatDistanceToNow(new Date(submission?.submittedAt || ''), { addSuffix: true })}
                        </p>
                        {submission?.grade && (
                          <p className="text-sm font-medium text-emerald-600 mt-1">
                            Grade: {submission.grade.score}/100
                          </p>
                        )}
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                        {submission?.grade ? 'Graded' : 'Submitted'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;