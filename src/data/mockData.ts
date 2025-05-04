import { User, Assignment, Submission, Notification } from '../types';
import { format, subDays, addDays } from 'date-fns';

// Create mock users
export const mockUsers: User[] = [
  {
    id: 'teacher-1',
    name: 'Professor Smith',
    email: 'teacher@example.com',
    role: 'teacher',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'student@example.com',
    role: 'student',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
  },
];

// Create mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: 'Introduction to React Hooks',
    description: 'Create a simple application that demonstrates the use of useState, useEffect, and useContext hooks in React.',
    createdBy: 'teacher-1',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'active',
    attachments: ['React_Hooks_Reference.pdf'],
  },
  {
    id: 'assignment-2',
    title: 'CSS Grid Layout Project',
    description: 'Design a responsive webpage layout using CSS Grid. The layout should adapt to different screen sizes.',
    createdBy: 'teacher-1',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'active',
    attachments: ['CSS_Grid_Guidelines.pdf'],
  },
  {
    id: 'assignment-3',
    title: 'API Integration Exercise',
    description: 'Create a small application that fetches and displays data from a public API of your choice. Implement proper error handling and loading states.',
    createdBy: 'teacher-1',
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'completed',
    attachments: ['API_Integration_Guide.pdf'],
  },
];

// Create mock submissions
export const mockSubmissions: Submission[] = [
  {
    id: 'submission-1',
    assignmentId: 'assignment-3',
    studentId: 'student-1',
    submittedAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    files: ['weather_api_solution.zip'],
    comment: 'I\'ve implemented a weather application using the OpenWeatherMap API.',
    grade: {
      score: 92,
      feedback: 'Excellent work! The application is well designed and the code is clean. Some improvements could be made to error handling.',
      gradedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    },
  },
];

// Create mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notification-1',
    userId: 'student-1',
    message: 'New assignment: Introduction to React Hooks',
    type: 'assignment',
    read: false,
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    linkTo: '/assignments/assignment-1',
  },
  {
    id: 'notification-2',
    userId: 'student-1',
    message: 'Your API Integration Exercise submission has been graded',
    type: 'grade',
    read: false,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    linkTo: '/submissions/submission-1',
  },
  {
    id: 'notification-3',
    userId: 'teacher-1',
    message: 'Alex Johnson submitted API Integration Exercise',
    type: 'submission',
    read: false,
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    linkTo: '/grade-submission/submission-1',
  },
];