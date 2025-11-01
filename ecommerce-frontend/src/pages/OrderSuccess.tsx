import React from 'react';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CheckCircleIcon = FiCheckCircle as React.ComponentType<{ className?: string }>;
const ShoppingBagIcon = FiShoppingBag as React.ComponentType<{ className?: string }>;

const OrderSuccess: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="text-3xl text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received it and will begin processing it right away.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-[#d7773e] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#d7773e] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                <span>We'll prepare your items for shipping</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#d7773e] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                <span>You'll receive a shipping notification when your order is on its way</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#d7773e] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                <span>Track your order in real-time until it arrives at your doorstep</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/orders">
              <Button className="flex items-center justify-center">
                <ShoppingBagIcon className="mr-2" /> View My Orders
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="flex items-center justify-center">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;