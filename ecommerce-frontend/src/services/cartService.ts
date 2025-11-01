import api from './api';

// Get cart items for the current user
export const getCartItems = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// Add a product to the cart
export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await api.post('/cart', { product_id: productId, quantity });
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeCartItem = async (itemId: number) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

// Clear the entire cart
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
}