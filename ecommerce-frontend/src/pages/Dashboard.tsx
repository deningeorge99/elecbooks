import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      const initializeAuth = async () => {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Redirect based on user role
          if (parsedUser.role === 'customer') {
            navigate('/customer/dashboard');
          } else if (parsedUser.role === 'seller') {
            navigate('/seller/dashboard');
          } else if (parsedUser.role === 'admin') {
            navigate('/admin/dashboard');
          }
        } else {
          navigate('/login');
        }
      };

      initializeAuth();
    }, [location.pathname]);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Redirecting to your dashboard...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7773e] mx-auto"></div>
      </div>
    </div>
  );
};

export default Dashboard;