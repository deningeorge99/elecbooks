import React, { useState, useEffect } from 'react';
import { FiEye, FiFilter, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { getAllOrders, updateOrderStatus as updateOrderStatusApi } from '../../services/adminService';

const EyeIcon = FiEye as React.ComponentType<{ className?: string }>;
const FilterIcon = FiFilter as React.ComponentType<{ className?: string }>;
const PackageIcon = FiPackage as React.ComponentType<{ className?: string }>;
const TruckIcon = FiTruck as React.ComponentType<{ className?: string }>;
const CheckIcon = FiCheck as React.ComponentType<{ className?: string }>;
const XIcon = FiX as React.ComponentType<{ className?: string }>;

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone: string;
  payment_method: string;
  created_at: string;
  user_name: string;
  user_email: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <PackageIcon className="text-yellow-500" />;
      case 'processing': return <PackageIcon className="text-blue-500" />;
      case 'shipped': return <TruckIcon className="text-indigo-500" />;
      case 'delivered': return <CheckIcon className="text-green-500" />;
      case 'cancelled': return <XIcon className="text-red-500" />;
      default: return <PackageIcon className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex items-center">
          <FilterIcon className="mr-2 text-gray-500" />
          <select 
            className="border border-gray-300 rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <PackageIcon className="mr-2 text-gray-400" />
                      <span className="font-medium">#{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                    <div className="text-sm text-gray-500">{order.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${order.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <EyeIcon />
                      </Button>
                      <select 
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Order #{selectedOrder.id}</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <p className="text-gray-600">{selectedOrder.user_name}</p>
                  <p className="text-gray-600">{selectedOrder.user_email}</p>
                  <p className="text-gray-600">{selectedOrder.phone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-gray-600">{selectedOrder.shipping_address}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                  <p className="text-gray-600 capitalize">{selectedOrder.payment_method.replace('_', ' ')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Status</h4>
                  <div className="flex items-center">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
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
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${(selectedOrder.total_amount - 5.99 - (selectedOrder.total_amount * 0.08)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${(selectedOrder.total_amount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${selectedOrder.total_amount}</span>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;