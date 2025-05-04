import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { createAssignment } from '../../services/data-service';
import { useAuth } from '../../context/AuthContext';

const CreateAssignmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    dueDate?: string;
  }>({});
  
  if (!user || user.role !== 'teacher') {
    return <div>You do not have permission to access this page.</div>;
  }
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle actual file uploads
    // For this demo, we'll just use the file names
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => file.name);
      setAttachments([...attachments, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      let dueDateISOString = new Date(dueDate).toISOString();
      
      if (dueTime) {
        // Parse the time and apply to the date
        const [hours, minutes] = dueTime.split(':').map(Number);
        const combinedDate = new Date(dueDate);
        combinedDate.setHours(hours, minutes);
        dueDateISOString = combinedDate.toISOString();
      }
      
      const newAssignment = createAssignment({
        title,
        description,
        createdBy: user.id,
        dueDate: dueDateISOString,
        status: 'active',
        attachments,
      });
      
      navigate(`/assignments/${newAssignment.id}`);
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
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Assignment</h1>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <Input
              label="Assignment Title"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              fullWidth
            />
            
            <Textarea
              label="Description"
              placeholder="Enter assignment description and instructions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              rows={6}
              fullWidth
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                leftIcon={<Calendar size={18} />}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={errors.dueDate}
                fullWidth
              />
              
              <Input
                label="Due Time (optional)"
                type="time"
                leftIcon={<Clock size={18} />}
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Materials (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
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
                    PDF, DOCX, ZIP up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center">
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
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Create Assignment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateAssignmentPage;