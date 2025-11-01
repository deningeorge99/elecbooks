import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const ShoppingCartIcon = FiShoppingCart as React.ComponentType<{ className?: string }>;
const UserIcon = FiUser as React.ComponentType<{ className?: string }>;
const SearchIcon = FiSearch as React.ComponentType<{ className?: string }>;
const MenuIcon = FiMenu as React.ComponentType<{ className?: string, size?: number }>;
const CloseIcon = FiX as React.ComponentType<{ className?: string, size?: number }>;
const LogoutIcon = FiLogOut as React.ComponentType<{ className?: string, size?: number }>;

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(user);
  const location = useLocation();

   useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      } else {
        setUserData(null);
      }
    };

    initializeAuth();
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      navigate('/products');
    }
  };

  return (
    <nav className={`bg-white/80 backdrop-blur-md text-gray-800 sticky top-0 z-50 shadow-md`}>
      <div className="container mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-[#d7773e]">E</span><span className="text-[#000000]">Commerce</span>
        </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
        <Link to="/products" className="text-[#000000] hover:text-[#d7773e] transition-colors">Products</Link>
        {userData?.role === 'seller' && (
          <Link to="/seller/dashboard" className="text-[#000000] hover:text-[#d7773e] transition-colors">Seller Dashboard</Link>
        )}
        {userData?.role === 'admin' && (
          <Link to="/admin/dashboard" className="text-[#000000] hover:text-[#d7773e] transition-colors">Admin Dashboard</Link>
        )}
        </div>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-6">
        <form onSubmit={handleSearch} className="relative">
          <input
          type="text"
          placeholder="Search products..."
          className="w-full py-2 px-4 pr-10 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
          <SearchIcon />
          </button>
        </form>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
        {userData ? (
          <>
          {userData.role === 'customer' && (
            <Link to="/cart" className="relative">
            <ShoppingCartIcon className="text-xl" />
            {/* Cart badge would go here */}
            </Link>
          )}
          <div className="relative group">
            <button className="flex items-center space-x-1">
            <UserIcon className="text-xl text-[#000000]" />
            <span className='text-[#000000]'>{userData.username}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
            {userData.role === 'customer' && (
              <>
              <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
              <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">My Cart</Link>
              </>
            )}
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <LogoutIcon className="mr-2" />
              Logout
            </button>
            </div>
          </div>
          </>
        ) : (
          <>
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
          </>
        )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        </div>
      </div>


      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-700">
        <div className="flex flex-col space-y-3">
          <Link to="/" className="hover:text-[#d7773e] transition-colors">Home</Link>
          <Link to="/products" className="hover:text-[#d7773e] transition-colors">Products</Link>
          {userData?.role === 'seller' && (
          <Link to="/seller/dashboard" className="hover:text-[#d7773e] transition-colors">Seller Dashboard</Link>
          )}
          {userData?.role === 'admin' && (
          <Link to="/admin/dashboard" className="hover:text-[#d7773e] transition-colors">Admin Dashboard</Link>
          )}
          
          <form onSubmit={handleSearch} className="mt-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          </form>
          
          {userData ? (
          <div className="pt-3 border-t border-gray-700 mt-3">
            <div className="flex items-center space-x-2 mb-3">
            <UserIcon className="text-xl" />
            <span>{userData.username}</span>
            </div>
            <Link to="/profile" className="block py-2 hover:text-[#d7773e]">My Profile</Link>
            {userData.role === 'customer' && (
            <>
              <Link to="/orders" className="block py-2 hover:text-[#d7773e]">My Orders</Link>
              <Link to="/cart" className="block py-2 hover:text-[#d7773e]">My Cart</Link>
            </>
            )}
            <button 
            onClick={logout}
            className="w-full text-left py-2 hover:text-[#d7773e] flex items-center"
            >
            <LogoutIcon className="mr-2" />
             Logout
            </button>
          </div>
          ) : (
          <div className="flex space-x-3 pt-3 border-t border-gray-700 mt-3">
            <Link to="/login" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Login</Button>
            </Link>
            <Link to="/register" className="flex-1">
            <Button size="sm" className="w-full">Register</Button>
            </Link>
          </div>
          )}
        </div>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;