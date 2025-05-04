import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FileUp, Calendar, Clock, Paperclip, ChevronLeft } from 'lucide-react';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { getAssignmentById, createSubmission, getSubmissionsByStudent } from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';

const AssignmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  if (!id || !user) return <div>Loading...</div>;
  
  const assignment = getAssignmentById(id);
  if (!assignment) return <div>Assignment not found</div>;
  
  const dueDate = new Date(assignment.dueDate);
  const createdDate = new Date(assignment.createdAt);
  const isPastDue = dueDate < new Date();
  
  // Check if student has already submitted
  const mySubmissions = getSubmissionsByStudent(user.id);
  const existingSubmission = mySubmissions.find(sub => sub.assignmentId === id);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle actual file uploads
    // For this demo, we'll just use the file names
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => file.name);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (files.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      createSubmission({
        assignmentId: id,
        studentId: user.id,
        files,
        comment,
      });
      
      setShowSuccess(true);
      
      // In a real app, you might want to redirect after a delay
      setTimeout(() => {
        navigate('/assignments');
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar size={16} className="mr-1" />
                    <span>Created on {format(createdDate, 'PPP')}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPastDue 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isPastDue ? 'Past Due' : 'Active'}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none">
                <p>{assignment.description}</p>
              </div>
              
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Assignment Materials</h3>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <Paperclip size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="flex items-center text-amber-600">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">
                  Due by {format(dueDate, 'PPP')} at {format(dueDate, 'p')}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Submission form */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Your Submission</h2>
            </CardHeader>
            
            <CardContent>
              {showSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 text-emerald-700">
                  <p className="font-medium">Assignment submitted successfully!</p>
                  <p className="text-sm mt-1">Redirecting to assignments page...</p>
                </div>
              ) : existingSubmission ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 text-indigo-700">
                  <p className="font-medium">You have already submitted this assignment</p>
                  <p className="text-sm mt-1">
                    Submitted on {format(new Date(existingSubmission.submittedAt), 'PPP')}
                  </p>
                  
                  {existingSubmission.grade && (
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <p className="font-medium">Grade: {existingSubmission.grade.score}/100</p>
                      <p className="text-sm mt-1">{existingSubmission.grade.feedback}</p>
                    </div>
                  )}
                </div>
              ) : isPastDue ? (
                <div className="bg-rose-50 border border-rose-200 rounded-md p-4 text-rose-700">
                  <p className="font-medium">This assignment is past due</p>
                  <p className="text-sm mt-1">
                    The due date was {format(dueDate, 'PPP')} at {format(dueDate, 'p')}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Files
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload files</span>
                              <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                                multiple
                                onChange={handleFileUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, DOCX, TXT, ZIP up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {files.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div 
                              key={index}
                              className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-200"
                            >
                              <div className="flex items-center">
                                <Paperclip size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">{file}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <span className="sr-only">Remove</span>
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Textarea
                      label="Comments (optional)"
                      placeholder="Add any comments about your submission"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      fullWidth
                      disabled={files.length === 0}
                      isLoading={isSubmitting}
                      onClick={handleSubmit}
                    >
                      Submit Assignment
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;