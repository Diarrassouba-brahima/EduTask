import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter } from 'date-fns';
import { PlusCircle, Calendar, Clock, FileText } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAssignmentsForStudent, getAssignmentsByTeacher, getSubmissionsByStudent } from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';
import { Assignment } from '../../types';

const AssignmentsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const isTeacher = user.role === 'teacher';
  const assignments = isTeacher 
    ? getAssignmentsByTeacher(user.id) 
    : getAssignmentsForStudent();
  
  // If student, get their submissions to show submission status
  const studentSubmissions = !isTeacher 
    ? getSubmissionsByStudent(user.id) 
    : [];
  
  const submittedAssignmentIds = studentSubmissions.map(s => s.assignmentId);
  
  const handleCreateAssignment = () => {
    navigate('/assignments/new');
  };
  
  const handleAssignmentClick = (assignment: Assignment) => {
    navigate(`/assignments/${assignment.id}`);
  };
  
  const filterActiveAssignments = (assignment: Assignment) => {
    return isTeacher || isAfter(new Date(assignment.dueDate), new Date());
  };
  
  const activeTabs = [
    { 
      label: isTeacher ? 'All Assignments' : 'Active Assignments', 
      filter: filterActiveAssignments,
      default: true
    },
    ...(isTeacher ? [] : [
      { 
        label: 'Submitted', 
        filter: (assignment: Assignment) => 
          submittedAssignmentIds.includes(assignment.id)
      },
      { 
        label: 'Past Due', 
        filter: (assignment: Assignment) => 
          !submittedAssignmentIds.includes(assignment.id) && 
          !isAfter(new Date(assignment.dueDate), new Date())
      }
    ])
  ];
  
  const [activeTab, setActiveTab] = React.useState(activeTabs[0]);
  const filteredAssignments = assignments.filter(activeTab.filter);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isTeacher ? 'My Assignments' : 'Assignments'}
        </h1>
        
        {isTeacher && (
          <Button
            onClick={handleCreateAssignment}
            leftIcon={<PlusCircle size={16} />}
          >
            Create Assignment
          </Button>
        )}
      </div>
      
      {/* Tabs for students */}
      {!isTeacher && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {activeTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab.label === tab.label
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
      
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              {isTeacher
                ? "You haven't created any assignments yet."
                : "No assignments found in this category."}
            </p>
            
            {isTeacher && (
              <Button
                onClick={handleCreateAssignment}
                leftIcon={<PlusCircle size={16} />}
              >
                Create Your First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const isPastDue = !isAfter(dueDate, new Date());
            const isSubmitted = submittedAssignmentIds.includes(assignment.id);
            
            return (
              <Card 
                key={assignment.id} 
                hover 
                onClick={() => handleAssignmentClick(assignment)}
                className={
                  !isTeacher && isSubmitted
                    ? 'border-l-4 border-l-emerald-500'
                    : !isTeacher && isPastDue
                    ? 'border-l-4 border-l-rose-500'
                    : ''
                }
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-between items-start">
                    <h2 className="font-medium text-gray-900">{assignment.title}</h2>
                    
                    {!isTeacher && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isSubmitted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPastDue
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isSubmitted
                          ? 'Submitted'
                          : isPastDue
                          ? 'Past Due'
                          : 'Active'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>
                      Due {format(dueDate, 'PPP')}
                    </span>
                  </div>
                  
                  {isTeacher && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        Created {format(new Date(assignment.createdAt), 'PPP')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentsListPage;