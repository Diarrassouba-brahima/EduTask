import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, Paperclip, Download, Award } from 'lucide-react';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { 
  getSubmissionById, 
  getAssignmentById, 
  getUserById,
  gradeSubmission 
} from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';

const GradeSubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    score?: string;
    feedback?: string;
  }>({});
  
  if (!id || !user || user.role !== 'teacher') {
    return <div>You do not have permission to access this page.</div>;
  }
  
  const submission = getSubmissionById(id);
  if (!submission) return <div>Submission not found</div>;
  
  const assignment = getAssignmentById(submission.assignmentId);
  if (!assignment) return <div>Assignment not found</div>;
  
  const student = getUserById(submission.studentId);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const scoreNum = Number(score);
    if (!score) {
      newErrors.score = 'Score is required';
    } else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      newErrors.score = 'Score must be a number between 0 and 100';
    }
    
    if (!feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      gradeSubmission(id, Number(score), feedback);
      setShowSuccess(true);
      
      // In a real app, you might want to redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <Button
        variant="ghost"
        onClick={handleBack}
        leftIcon={<ChevronLeft size={16} />}
        className="mb-4"
      >
        Back
      </Button>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Grade Submission
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{assignment.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by {student?.name || 'Unknown Student'} on {format(new Date(submission.submittedAt), 'PPP')}
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none mb-6">
                <h3 className="text-base font-medium">Assignment Description</h3>
                <p>{assignment.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-medium mb-3">Submission Files</h3>
                
                <div className="space-y-2">
                  {submission.files.map((file, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center">
                        <Paperclip size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download size={16} />}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {submission.comment && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-base font-medium mb-3">Student Comment</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">{submission.comment}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Grading form */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award size={18} className="mr-2 text-indigo-600" />
                Grade Submission
              </h2>
            </CardHeader>
            
            <CardContent>
              {showSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-emerald-700">
                  <p className="font-medium">Submission graded successfully!</p>
                  <p className="text-sm mt-1">Redirecting to dashboard...</p>
                </div>
              ) : submission.grade ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 text-indigo-700">
                  <p className="font-medium">This submission has already been graded</p>
                  <p className="text-sm mt-1">
                    Graded on {format(new Date(submission.grade.gradedAt), 'PPP')}
                  </p>
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <p className="font-medium">Score: {submission.grade.score}/100</p>
                    <p className="text-sm mt-1">{submission.grade.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Score (0-100)"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    error={errors.score}
                    fullWidth
                  />
                  
                  <Textarea
                    label="Feedback"
                    placeholder="Provide detailed feedback to the student"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    error={errors.feedback}
                    rows={6}
                    fullWidth
                  />
                  
                  <Button
                    fullWidth
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                  >
                    Submit Grade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionPage;