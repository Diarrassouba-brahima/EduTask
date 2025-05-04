import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <BookOpen size={48} className="mr-4" />
            <h1 className="text-4xl font-bold">EduTask</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">
            The learning platform that connects students and teachers
          </h2>
          
          <p className="text-indigo-200 mb-8">
            Create, assign, and track educational tasks in one place. 
            EduTask makes it simple to manage coursework, provide feedback, 
            and foster academic growth.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">For Teachers</h3>
              <p className="text-indigo-200 text-sm">
                Easily create and manage assignments, track student progress, and provide timely feedback.
              </p>
            </div>
            
            <div className="bg-indigo-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">For Students</h3>
              <p className="text-indigo-200 text-sm">
                Stay organized with upcoming assignments, submit work on time, and receive helpful instructor feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - auth forms */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center mb-8">
            <BookOpen size={36} className="text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-indigo-600">EduTask</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;