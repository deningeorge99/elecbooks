import React, { useEffect, useState } from 'react';
import { FiCreditCard, FiTruck, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { placeOrder } from '../services/orderService';

const CreditCardIcon = FiCreditCard as React.ComponentType<{ className?: string }>;
const TruckIcon = FiTruck as React.ComponentType<{ className?: string }>;
const CheckIcon = FiCheck as React.ComponentType<{ className?: string }>;
const ArrowLeftIcon = FiArrowLeft as React.ComponentType<{ className?: string }>;

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal, fetchCartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [orderData, setOrderData] = useState({
    shipping_address: 'Address', // Set to empty string or replace with the correct property, e.g., user?.shipping_address || ''
    phone: 'Phone Number',
    payment_method: 'credit_card'
  });

  const subtotal = getCartTotal();
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      await placeOrder(orderData);
      // Clear cart and redirect to order confirmation
      fetchCartItems(); // This will clear the cart since all items are now ordered
      navigate('/order-success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
      }
    };

    initializeAuth();
  }, [location.pathname]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-[#d7773e] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  <div className={`h-1 w-16 ${
                    step > s ? 'bg-[#d7773e]' : 'bg-gray-200'
                  }`}></div>
                  <span className={`ml-2 mr-6 ${
                    step >= s ? 'text-[#d7773e] font-medium' : 'text-gray-500'
                  }`}>
                    {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {step === 1 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <TruckIcon className="mr-2" /> Shipping Information
                </h2>
                
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your address"
                    name="shipping_address"
                    value={orderData.shipping_address}
                    onChange={handleInputChange}
                    label="Shipping Address"
                    required
                  />
                  
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    label="Phone Number"
                    required
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {step === 2 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCardIcon className="mr-2" /> Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#d7773e]">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit_card"
                        name="payment_method"
                        value="credit_card"
                        checked={orderData.payment_method === 'credit_card'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <label htmlFor="credit_card" className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Pay with Visa, Mastercard, or other cards</div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#d7773e]">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="payment_method"
                        value="paypal"
                        checked={orderData.payment_method === 'paypal'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <label htmlFor="paypal" className="flex-1">
                        <div className="font-medium">PayPal</div>
                        <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#d7773e]">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        name="payment_method"
                        value="cash_on_delivery"
                        checked={orderData.payment_method === 'cash_on_delivery'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <label htmlFor="cash_on_delivery" className="flex-1">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeftIcon className="mr-2" /> Back to Shipping
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Continue to Review
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {step === 3 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CheckIcon className="mr-2" /> Review Your Order
                </h2>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p>{orderData.shipping_address}</p>
                  <p>{orderData.phone}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="capitalize">{orderData.payment_method.replace('_', ' ')}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x {item.quantity}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeftIcon className="mr-2" /> Back to Payment
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Items in your order</h3>
                <div className="space-y-2">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded mr-3">
                        <img 
                          src={item.image_url || 'https://via.placeholder.com/40x40?text=Product'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <div className="text-sm text-gray-600">
                      and {cartItems.length - 3} more item(s)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;