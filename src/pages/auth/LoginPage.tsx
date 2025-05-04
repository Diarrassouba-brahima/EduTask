import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo login shortcuts
  const loginAsTeacher = async () => {
    setEmail('teacher@example.com');
    setPassword('password123');
    
    try {
      setIsLoading(true);
      const success = await login('teacher@example.com', 'password123');
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginAsStudent = async () => {
    setEmail('student@example.com');
    setPassword('password123');
    
    try {
      setIsLoading(true);
      const success = await login('student@example.com', 'password123');
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Log in to your account
      </h2>
      
      {error && (
        <div className="bg-rose-50 text-rose-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={18} />}
          placeholder="your@email.com"
          fullWidth
          required
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={18} />}
          placeholder="Your password"
          fullWidth
          required
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Log in
        </Button>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Register now
          </Link>
        </p>
      </div>
      
      {/* Demo account section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
          Demo Accounts
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={loginAsTeacher}
            disabled={isLoading}
          >
            Login as Teacher
          </Button>
          
          <Button
            variant="outline"
            onClick={loginAsStudent}
            disabled={isLoading}
          >
            Login as Student
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;