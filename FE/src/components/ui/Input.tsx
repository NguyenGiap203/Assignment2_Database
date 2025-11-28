// components/ui/Input.tsx

import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Cho phép truyền icon vào (ví dụ: <Search />)
}

const baseStyles = "w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none";

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  const inputClassName = `${baseStyles} ${
    error 
      ? 'border-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
  } ${icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </span>
        )}
        <input 
          className={inputClassName}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default React.memo(Input);