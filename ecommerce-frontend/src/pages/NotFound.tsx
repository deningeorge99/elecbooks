import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';

const HomeIcon = FiHome as React.ComponentType<{ className?: string }>;
const SearchIcon = FiSearch as React.ComponentType<{ className?: string }>;

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#d7773e]">404</h1>
          <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button className="flex items-center">
              <HomeIcon className="mr-2" /> 
              Go to Homepage
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="flex items-center">
              <SearchIcon className="mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;