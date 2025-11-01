import api from './api';

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Get user by ID (admin only)
export const getUserById = async (userId: number) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

// Create new user (admin only)
export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Update user (admin only)
export const updateUser = async (userId: number, userData: {
  username?: string;
  email?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// Delete user (admin only)
export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Get all products (admin only)
export const getAllProducts = async () => {
  const response = await api.get('/admin/products');
  return response.data;
};

// Get product by ID (admin only)
export const getProductById = async (productId: number) => {
  const response = await api.get(`/admin/products/${productId}`);
  return response.data;
};

// Create new product (admin only)
export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  seller_id: number;
  image_url?: string;
}) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

// Update product (admin only)
export const updateProduct = async (productId: number, productData: {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  category_id?: number;
  seller_id?: number;
  image_url?: string;
}) => {
  const response = await api.put(`/admin/products/${productId}`, productData);
  return response.data;
};

// Delete product (admin only)
export const deleteProduct = async (productId: number) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

// Get order by ID (admin only)
export const getOrderById = async (orderId: number) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.put(`/admin/orders/${orderId}`, { status });
  return response.data;
};

// Get dashboard stats (admin only)
export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};