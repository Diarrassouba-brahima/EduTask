import { 
  mockAssignments, 
  mockSubmissions, 
  mockNotifications,
  mockUsers
} from '../data/mockData';
import { 
  Assignment, 
  Submission, 
  Notification, 
  User
} from '../types';

// Assignment-related services
export const getAssignmentsByTeacher = (teacherId: string): Assignment[] => {
  return mockAssignments.filter(assignment => assignment.createdBy === teacherId);
};

export const getAssignmentsForStudent = (): Assignment[] => {
  return mockAssignments;
};

export const getAssignmentById = (id: string): Assignment | undefined => {
  return mockAssignments.find(assignment => assignment.id === id);
};

export const createAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
  const newAssignment: Assignment = {
    ...assignment,
    id: `assignment-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  mockAssignments.push(newAssignment);
  
  // Create notifications for all students
  const students = mockUsers.filter(user => user.role === 'student');
  students.forEach(student => {
    createNotification({
      userId: student.id,
      message: `New assignment: ${newAssignment.title}`,
      type: 'assignment',
      linkTo: `/assignments/${newAssignment.id}`,
    });
  });
  
  return newAssignment;
};

export const updateAssignment = (id: string, update: Partial<Assignment>): Assignment | undefined => {
  const index = mockAssignments.findIndex(assignment => assignment.id === id);
  if (index !== -1) {
    mockAssignments[index] = { ...mockAssignments[index], ...update };
    return mockAssignments[index];
  }
  return undefined;
};

export const deleteAssignment = (id: string): boolean => {
  const index = mockAssignments.findIndex(assignment => assignment.id === id);
  if (index !== -1) {
    mockAssignments.splice(index, 1);
    return true;
  }
  return false;
};

// Submission-related services
export const getSubmissionsByAssignment = (assignmentId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.assignmentId === assignmentId);
};

export const getSubmissionsByStudent = (studentId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.studentId === studentId);
};

export const getSubmissionById = (id: string): Submission | undefined => {
  return mockSubmissions.find(submission => submission.id === id);
};

export const createSubmission = (
  submission: Omit<Submission, 'id' | 'submittedAt' | 'grade'>
): Submission => {
  const newSubmission: Submission = {
    ...submission,
    id: `submission-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  
  mockSubmissions.push(newSubmission);
  
  // Get the assignment
  const assignment = getAssignmentById(submission.assignmentId);
  
  // Create notification for the teacher
  if (assignment) {
    createNotification({
      userId: assignment.createdBy,
      message: `New submission for ${assignment.title}`,
      type: 'submission',
      linkTo: `/grade-submission/${newSubmission.id}`,
    });
  }
  
  return newSubmission;
};

export const gradeSubmission = (
  id: string, 
  score: number, 
  feedback: string
): Submission | undefined => {
  const index = mockSubmissions.findIndex(submission => submission.id === id);
  if (index !== -1) {
    mockSubmissions[index] = { 
      ...mockSubmissions[index], 
      grade: {
        score,
        feedback,
        gradedAt: new Date().toISOString(),
      }
    };
    
    // Create notification for the student
    createNotification({
      userId: mockSubmissions[index].studentId,
      message: 'Your submission has been graded',
      type: 'grade',
      linkTo: `/submissions/${id}`,
    });
    
    return mockSubmissions[index];
  }
  return undefined;
};

// Notification-related services
export const getNotificationsForUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => 
    notification.userId === userId
  ).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const markNotificationAsRead = (id: string): Notification | undefined => {
  const index = mockNotifications.findIndex(notification => notification.id === id);
  if (index !== -1) {
    mockNotifications[index] = { ...mockNotifications[index], read: true };
    return mockNotifications[index];
  }
  return undefined;
};

export const createNotification = (
  notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `notification-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  mockNotifications.push(newNotification);
  return newNotification;
};

// User-related services
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};