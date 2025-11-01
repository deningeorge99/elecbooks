import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  style
}) => {
  const { colors } = useTheme();
  
  const baseStyles = `inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`;
  
  const variantStyles = {
    primary: `bg-[${colors.primary}] text-white hover:bg-opacity-90 focus:ring-[${colors.primary}]`,
    secondary: `bg-[${colors.secondary}] text-[${colors.accent}] hover:bg-gray-200 focus:ring-[${colors.accent}]`,
    outline: `border border-[${colors.primary}] text-[${colors.primary}] hover:bg-[${colors.primary}] hover:text-white focus:ring-[${colors.primary}]`,
    danger: `bg-[${colors.danger}] text-white hover:bg-opacity-90 focus:ring-[${colors.danger}]`,
    success: `bg-[${colors.success}] text-white hover:bg-opacity-90 focus:ring-[${colors.success}]`,
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={style}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;