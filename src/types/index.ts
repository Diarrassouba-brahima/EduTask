export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  status: 'active' | 'completed' | 'graded';
  attachments?: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  files: string[];
  comment?: string;
  grade?: {
    score: number;
    feedback: string;
    gradedAt: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'assignment' | 'submission' | 'grade' | 'announcement';
  read: boolean;
  createdAt: string;
  linkTo?: string;
}