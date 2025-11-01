import React, { useState } from 'react';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const UserIcon = FiUser as React.ComponentType<{ className?: string }>;
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string }>;
const HeartIcon = FiHeart as React.ComponentType<{ className?: string }>;
const MapPinIcon = FiMapPin as React.ComponentType<{ className?: string }>;
const CreditCardIcon = FiCreditCard as React.ComponentType<{ className?: string }>;
const LogOutIcon = FiLogOut as React.ComponentType<{ className?: string }>;

const CustomerDashboard: React.FC = () => {
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
                <UserIcon className="text-2xl text-gray-600" />
              </div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'overview' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <UserIcon className="mr-3" /> Account Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'orders' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBagIcon className="mr-3" /> My Orders
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'wishlist' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <HeartIcon className="mr-3" /> My Wishlist
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'addresses' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <MapPinIcon className="mr-3" /> My Addresses
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'payment' ? 'bg-[#d7773e] text-white' : 'hover:bg-gray-100'
                }`}
              >
                <CreditCardIcon className="mr-3" /> Payment Methods
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
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">12</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Wishlist Items</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">8</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Saved Addresses</h3>
                    <p className="text-3xl font-bold text-[#d7773e]">2</p>
                  </Card>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-medium">Order #ORD00{order}</p>
                        <p className="text-sm text-gray-600">Placed on 05/0{order}/2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(order * 45.99).toFixed(2)}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div key={order} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold">Order #ORD00{order}</h3>
                          <p className="text-sm text-gray-600">Placed on 05/0{order}/2023</p>
                        </div>
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Delivered
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">${(order * 45.99).toFixed(2)}</p>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="flex">
                      <div className="w-1/3">
                        <img 
                          src={`https://via.placeholder.com/150x150?text=Product${item}`} 
                          alt={`Product ${item}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-medium mb-1">Product Name {item}</h3>
                        <p className="text-gray-600 text-sm mb-2">Category</p>
                        <p className="font-bold mb-3">${(item * 19.99).toFixed(2)}</p>
                        <Button size="sm">Add to Cart</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Addresses</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold mb-2">Home Address</h3>
                        <p className="text-gray-600">123 Main Street, Apt 4B</p>
                        <p className="text-gray-600">New York, NY 10001</p>
                        <p className="text-gray-600">United States</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold mb-2">Work Address</h3>
                        <p className="text-gray-600">456 Business Ave, Floor 12</p>
                        <p className="text-gray-600">New York, NY 10005</p>
                        <p className="text-gray-600">United States</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Button className="w-full">Add New Address</Button>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-gray-200 w-12 h-8 rounded mr-3"></div>
                        <div>
                          <p className="font-medium">Visa ending in 1234</p>
                          <p className="text-sm text-gray-600">Expires 12/2025</p>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-gray-200 w-12 h-8 rounded mr-3"></div>
                        <div>
                          <p className="font-medium">Mastercard ending in 5678</p>
                          <p className="text-sm text-gray-600">Expires 08/2024</p>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </Card>
                  
                  <Button className="w-full">Add Payment Method</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;