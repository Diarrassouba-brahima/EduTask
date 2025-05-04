import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { PlusCircle, FileCheck, Calendar, Users } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAssignmentsByTeacher, getSubmissionsByAssignment } from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';
import { mockSubmissions } from '../../data/mockData';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const myAssignments = getAssignmentsByTeacher(user.id);
  
  // Calculate pending submissions
  const pendingSubmissions = mockSubmissions.filter(submission => 
    !submission.grade && 
    myAssignments.some(assignment => assignment.id === submission.assignmentId)
  );
  
  // Find assignments with upcoming deadlines (within 7 days)
  const upcomingDeadlines = myAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7 && diffDays > 0;
  });
  
  const handleCreateAssignment = () => {
    navigate('/assignments/new');
  };
  
  const handleViewAllAssignments = () => {
    navigate('/assignments');
  };
  
  const handleGradeSubmission = (submissionId: string) => {
    navigate(`/grade-submission/${submissionId}`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        
        <Button
          onClick={handleCreateAssignment}
          leftIcon={<PlusCircle size={16} />}
        >
          Create Assignment
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="py-6">
            <div className="flex items-center">
              <Calendar size={28} className="text-indigo-600 mr-4" />
              <div>
                <h3 className="text-indigo-800 font-medium mb-1">Total Assignments</h3>
                <p className="text-3xl font-bold text-indigo-600">{myAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-6">
            <div className="flex items-center">
              <FileCheck size={28} className="text-amber-600 mr-4" />
              <div>
                <h3 className="text-amber-800 font-medium mb-1">Pending Submissions</h3>
                <p className="text-3xl font-bold text-amber-600">{pendingSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-6">
            <div className="flex items-center">
              <Users size={28} className="text-emerald-600 mr-4" />
              <div>
                <h3 className="text-emerald-800 font-medium mb-1">Upcoming Deadlines</h3>
                <p className="text-3xl font-bold text-emerald-600">{upcomingDeadlines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent assignments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
          
          <Button
            variant="ghost"
            onClick={handleViewAllAssignments}
          >
            View All
          </Button>
        </div>
        
        {myAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 mb-4">You haven't created any assignments yet.</p>
              <Button
                onClick={handleCreateAssignment}
                leftIcon={<PlusCircle size={16} />}
              >
                Create Your First Assignment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignments.slice(0, 4).map((assignment) => {
              const submissions = getSubmissionsByAssignment(assignment.id);
              return (
                <Card 
                  key={assignment.id} 
                  hover 
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  <CardContent>
                    <h3 className="font-medium text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {submissions.length} submissions
                      </span>
                      
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        new Date(assignment.dueDate) < new Date()
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {new Date(assignment.dueDate) < new Date() ? 'Closed' : 'Active'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Pending submissions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submissions to Grade</h2>
        
        {pendingSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              No pending submissions to grade. Great job staying on top of things!
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Assignment</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Grade</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {pendingSubmissions.map((submission) => {
                  const assignment = myAssignments.find(a => a.id === submission.assignmentId);
                  return (
                    <tr key={submission.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {assignment?.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {/* In a real app, this would show the student name */}
                        Alex Johnson
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleGradeSubmission(submission.id)}
                        >
                          Grade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;