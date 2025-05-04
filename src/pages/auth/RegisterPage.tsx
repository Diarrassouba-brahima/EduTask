import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!name || !email || !password) {
        throw new Error('Please fill in all required fields');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const success = await register(name, email, password, role);
      
      if (success) {
        navigate('/');
      } else {
        throw new Error('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Create your account
      </h2>
      
      {error && (
        <div className="bg-rose-50 text-rose-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User size={18} />}
          placeholder="Your full name"
          fullWidth
          required
        />
        
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
          placeholder="Create a password"
          hint="Password must be at least 6 characters long"
          fullWidth
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock size={18} />}
          placeholder="Confirm your password"
          fullWidth
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            I am a
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`border rounded-md text-center py-3 cursor-pointer transition-colors ${
                role === 'student' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setRole('student')}
            >
              Student
            </div>
            
            <div 
              className={`border rounded-md text-center py-3 cursor-pointer transition-colors ${
                role === 'teacher' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setRole('teacher')}
            >
              Teacher
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;