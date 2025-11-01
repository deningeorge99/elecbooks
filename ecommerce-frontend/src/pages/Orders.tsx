import React, { useEffect, useState } from 'react';
import { FiPackage, FiEye, FiCalendar, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getOrderHistory } from '../services/orderService';

const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const EyeIcon = FiEye as React.ComponentType<{ className?: string }>;
const CalendarIcon = FiCalendar as React.ComponentType<{ className?: string }>;
const MapPinIcon = FiMapPin as React.ComponentType<{ className?: string }>;
const CreditCardIcon = FiCreditCard as React.ComponentType<{ className?: string }>;

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderHistory();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="mb-6">You need to login to view your orders.</p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {loading ? (
        <div className="text-center py-12">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <PackageIcon className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't placed any orders yet.</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Order #{order.id}</h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <CalendarIcon className="mr-2" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Shipping Address</h3>
                    <div className="flex items-start text-gray-600">
                      <MapPinIcon className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{order.shipping_address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Payment Method</h3>
                    <div className="flex items-center text-gray-600">
                      <CreditCardIcon className="mr-2 flex-shrink-0" />
                      <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Total Amount</h3>
                    <p className="text-lg font-bold">${order.total_amount}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded mr-3">
                            <img 
                              src={`https://via.placeholder.com/40x40?text=${item.product_name.charAt(0)}`} 
                              alt={item.product_name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">${(item.price_at_purchase * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Link to={`/orders/${order.id}`}>
                    <Button size="sm">
                      <EyeIcon className="mr-2" /> View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;