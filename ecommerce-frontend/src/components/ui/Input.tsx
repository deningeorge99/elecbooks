import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
// import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  label,
  error,
  className = '',
  icon,
  required = false,
  min,
  max,
  step
}) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : isFocused
              ? `border-[${colors.primary}] focus:ring-[${colors.primary}] focus:border-[${colors.primary}]`
              : 'border-gray-300'
          }`}
          required={required}
          min={min}
          max={max}
          step={step}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* {showPassword ? 
            <FiEyeOff className="text-gray-500" /> : 
            <FiEye className="text-gray-500" />} */}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;