import api from './api';
import { Product } from '../types/product';

export const getProducts = async (params?: any) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products?featured=true');
  return response.data;
};

// Add new product (for sellers)
export const addProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url?: string;
}) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update existing product (for sellers)
export const updateProduct = async (id: number, productData: {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url?: string;
}) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (for sellers)
export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Get categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};