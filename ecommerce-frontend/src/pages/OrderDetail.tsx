import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiEye, FiCalendar, FiMapPin, FiCreditCard, FiArrowLeft, FiPrinter } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getOrderById } from '../services/orderService';

const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const CalendarIcon = FiCalendar as React.ComponentType<{ className?: string }>;
const MapPinIcon = FiMapPin as React.ComponentType<{ className?: string }>;
const CreditCardIcon = FiCreditCard as React.ComponentType<{ className?: string }>;
const ArrowLeftIcon = FiArrowLeft as React.ComponentType<{ className?: string, size?: number }>;
const PrinterIcon = FiPrinter as React.ComponentType<{ className?: string, size?: number }>;

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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          const data = await getOrderById(parseInt(id));
          setOrder(data);
        } catch (error) {
          console.error('Failed to fetch order:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [id]);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2" /> Back to Orders
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Order #{order.id}</h1>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded mr-4">
                          <img 
                            src={`https://via.placeholder.com/64x64?text=${item.product_name.charAt(0)}`} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.price_at_purchase.toFixed(2)} each</div>
                        <div className="font-bold">${(item.price_at_purchase * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <PackageIcon className="text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-green-500 mt-1"></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {order.status !== 'pending' ? <PackageIcon className="text-white" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className={`h-full w-0.5 mt-1 ${
                      order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="font-medium">Order Processing</h3>
                    <p className="text-sm text-gray-600">
                      {order.status !== 'pending' ? 'Your order is being prepared' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {['shipped', 'delivered'].includes(order.status) ? <PackageIcon className="text-white" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className={`h-full w-0.5 mt-1 ${
                      ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="pb-4">
                    <h3 className="font-medium">Order Shipped</h3>
                    <p className="text-sm text-gray-600">
                      {['shipped', 'delivered'].includes(order.status) ? 'Your order is on its way' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {order.status === 'delivered' ? <PackageIcon className="text-white" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Order Delivered</h3>
                    <p className="text-sm text-gray-600">
                      {order.status === 'delivered' ? 'Your order has been delivered' : 'Pending'}
                    </p>
                  </div>
                </div>
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
                  <span>${(order.total_amount - 5.99 - (order.total_amount * 0.08)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.total_amount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${order.total_amount}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full">
                  <PrinterIcon className="mr-2" /> Print Invoice
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="mt-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;