// Login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import Login from '../../pages/Login';
import LoginForm from './LoginForm';

// Mock the dependencies
jest.mock('../../hooks/useAuth');
jest.mock('../../services/authService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      user: null,
      token: null,
    });

    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  });

  describe('Login Page', () => {
    it('renders login page correctly', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByText('Or')).toBeInTheDocument();
      expect(screen.getByText('create a new account')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'create a new account' })).toHaveAttribute('href', '/register');
    });
  });

  describe('LoginForm Component', () => {
    const renderLoginForm = () => {
      return render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );
    };

    it('renders login form with all elements', () => {
      renderLoginForm();

      expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register');
    });

    it('allows user to fill in email and password', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'denin@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345678' } });

      expect(emailInput).toHaveValue('denin@gmail.com');
      expect(passwordInput).toHaveValue('12345678');
    });

    it('submits form with valid data and redirects on success', async () => {
      const mockUser = { id: 1, email: 'denin@gmail.com', name: 'Denin' };
      const mockToken = 'mock-jwt-token';
      
      mockLoginUser.mockResolvedValueOnce({
        user: mockUser,
        token: mockToken,
      });

      renderLoginForm();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: 'password123' } 
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Check if loginUser was called with correct data
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Check if login function was called and navigation occurred
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(mockUser, mockToken);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('shows loading state during form submission', async () => {
      mockLoginUser.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderLoginForm();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: 'password123' } 
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Check if button shows loading state
      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    });

    it('displays error message when login fails', async () => {
      const errorMessage = 'Invalid email or password';
      mockLoginUser.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage
          }
        }
      });

      renderLoginForm();

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText(/password/i), { 
        target: { value: 'wrongpassword' } 
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Check if error message is displayed
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Check that login and navigation were not called
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to register page when sign up link is clicked', () => {
      renderLoginForm();

      const signUpLink = screen.getByRole('link', { name: /sign up/i });
      expect(signUpLink).toHaveAttribute('href', '/register');
    });

    it('handles remember me checkbox', () => {
      renderLoginForm();

      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
      
      // Initially unchecked
      expect(rememberMeCheckbox).not.toBeChecked();
      
      // Check the checkbox
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
      
      // Uncheck the checkbox
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });
});