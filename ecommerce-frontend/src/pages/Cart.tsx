import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const ShoppingCartIcon = FiShoppingCart as React.ComponentType<{ className?: string }>;
const TrashIcon = FiTrash2 as React.ComponentType<{ className?: string }>;
const PlusIcon = FiPlus as React.ComponentType<{ className?: string, size?: number }>;
const MinusIcon = FiMinus as React.ComponentType<{ className?: string, size?: number }>;
const ArrowRightIcon = FiArrowRight as React.ComponentType<{ className?: string, size?: number }>;
const ArrowLeftIcon = FiArrowLeft as React.ComponentType<{ className?: string, size?: number }>;

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { 
    cartItems, 
    loading, 
    error, 
    updateCartItem, 
    removeCartItem, 
    getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(user);
   const location = useLocation();
  
  useEffect(() => {
  const initializeAuth = async () => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      setUserData(null);
      navigate('/login');
    }
  };

  initializeAuth();
}, [location.pathname]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!userData) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">Loading your cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCartIcon className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden mr-4">
                        <img 
                          src={item.image_url || 'https://via.placeholder.com/100x100?text=Product'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600 text-sm">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon size={14} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                          {item.quantity}
                        </div>
                        <button 
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock_quantity || 10)}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      
                      <div className="ml-4 w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button 
                        className="ml-4 text-gray-500 hover:text-red-500"
                        onClick={() => removeCartItem(item.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(getCartTotal() + 5.99 + (getCartTotal() * 0.08)).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout <ArrowRightIcon className="ml-2" />
                </Button>
                
                <div className="mt-4">
                  <a href="/products" className="text-[#d7773e] hover:text-[#c6662d] flex items-center justify-center">
                    <ArrowLeftIcon className="mr-2" /> Continue Shopping
                  </a>
                </div>
              </div>
            </Card>
            
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="font-medium mb-3">Have a promo code?</h3>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter promo code"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#d7773e]"
                  />
                  <Button className="rounded-l-none">Apply</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;