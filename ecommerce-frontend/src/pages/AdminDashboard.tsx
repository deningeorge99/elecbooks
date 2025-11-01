import React, { useEffect, useState } from 'react';
import {FiPlus, FiUsers, FiShoppingBag, FiDollarSign, FiSettings, FiLogOut, FiBarChart2, FiPackage, FiUserPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

import DashboardStatsComponent from '../components/admin/DashboardStats';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';

const PlusIcon = FiPlus as React.ComponentType<{ className?: string }>;
const UsersIcon = FiUsers as React.ComponentType<{ className?: string }>;
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string }>;
const DollarSignIcon = FiDollarSign as React.ComponentType<{ className?: string }>;
const SettingsIcon = FiSettings as React.ComponentType<{ className?: string }>;
const LogOutIcon = FiLogOut as React.ComponentType<{ className?: string }>;
const BarChartIcon = FiBarChart2 as React.ComponentType<{ className?: string }>;
const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const UserPlusIcon = FiUserPlus as React.ComponentType<{ className?: string }>;

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <SettingsIcon className="text-2xl text-gray-600" />
              </div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="mt-2 bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Admin Account
              </span>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'overview' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <BarChartIcon className="mr-3" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'users' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <PackageIcon className="mr-3" /> Manage Users
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'products' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <PackageIcon className="mr-3" /> Manage Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'orders' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBagIcon className="mr-3" /> Manage Orders
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'earnings' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <DollarSignIcon className="mr-3" /> Revenue
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'settings' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <SettingsIcon className="mr-3" /> Settings
              </button>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <LogOutIcon className="mr-2" /> Logout
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <Card className="p-6">
            
            {activeTab === 'overview' && <DashboardStatsComponent />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                        <input
                          type="text"
                          defaultValue="ECommerce"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Email</label>
                        <input
                          type="email"
                          defaultValue="admin@ecommerce.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="paypal"
                          type="checkbox"
                          className="h-4 w-4 text-[#d7773e] focus:ring-[#d7773e] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="paypal" className="ml-2 block text-sm text-gray-700">
                          Enable PayPal
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="stripe"
                          type="checkbox"
                          className="h-4 w-4 text-[#d7773e] focus:ring-[#d7773e] border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="stripe" className="ml-2 block text-sm text-gray-700">
                          Enable Stripe
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="cod"
                          type="checkbox"
                          className="h-4 w-4 text-[#d7773e] focus:ring-[#d7773e] border-gray-300 rounded"
                        />
                        <label htmlFor="cod" className="ml-2 block text-sm text-gray-700">
                          Enable Cash on Delivery
                        </label>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Earnings</h2>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span>Current Month</span>
                      <span className="text-xl font-bold">$4,250</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Previous Month</span>
                      <span className="text-xl font-bold">$3,890</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Earnings by Product</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((product) => (
                    <div key={product} className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-medium">Product Name {product}</p>
                        <p className="text-sm text-gray-600">25 sold</p>
                      </div>
                      <p className="font-medium">${(product * 150).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;