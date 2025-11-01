import api from './api';

// Place a new order
export const placeOrder = async (orderData: {
  shipping_address: string;
  phone: string;
  payment_method: string;
}) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Get order history for the current user
export const getOrderHistory = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Get order details by ID
export const getOrderById = async (orderId: number) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};