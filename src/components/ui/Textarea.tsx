import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  fullWidth = false,
  id,
  className = '',
  rows = 4,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseTextareaClasses = 'block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
  const errorClasses = error ? 'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const textareaClasses = `${baseTextareaClasses} ${errorClasses} ${widthClasses} ${className}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...props}
      />
      
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-rose-600">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p id={`${textareaId}-hint`} className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Textarea;