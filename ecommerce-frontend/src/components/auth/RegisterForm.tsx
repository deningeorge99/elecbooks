import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiHome } from 'react-icons/fi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { registerUser } from '../../services/authService';

const UserIcon = FiUser as React.ComponentType<{ className?: string }>;
const MailIcon = FiMail as React.ComponentType<{ className?: string }>;
const LockIcon = FiLock as React.ComponentType<{ className?: string }>;
const PhoneIcon = FiPhone as React.ComponentType<{ className?: string }>;
const HomeIcon = FiHome as React.ComponentType<{ className?: string }>;

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      const response = await registerUser(registerData);
      // login(response.user, response.token);
      // navigate('/dashboard');
      navigate('/login');
    } catch (err: any) {
      setErrors({ form: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
          
          {errors.form && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                placeholder="First name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                label="First Name"
              />
              
              <Input
                type="text"
                placeholder="Last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                label="Last Name"
              />
            </div>
            
            <Input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="Username"
              icon={<UserIcon />}
              error={errors.username}
            />
            
            <Input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email"
              icon={<MailIcon />}
              error={errors.email}
            />
            
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              icon={<LockIcon />}
              error={errors.password}
            />
            
            <Input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              icon={<LockIcon />}
              error={errors.confirmPassword}
            />
            
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                type="tel"
                placeholder="Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                label="Phone"
                icon={<PhoneIcon />}
              />
              
              <Input
                type="text"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                label="Address"
                icon={<HomeIcon />}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-[#d7773e] hover:text-[#c6662d]">
                Sign in
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterForm;