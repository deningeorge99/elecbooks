import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  getCartItems, 
  addToCart as addToCartService, 
  updateCartItem as updateCartItemService, 
  removeCartItem as removeCartItemService 
} from '../services/cartService';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url?: string;
  stock_quantity?: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCartItems = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const items = await getCartItems();
        setCartItems(items);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    setLoading(true);
    try {
      await addToCartService(productId, quantity);
      fetchCartItems(); // Refresh cart
      setError('');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setLoading(true);
    try {
      await updateCartItemService(itemId, quantity);
      fetchCartItems(); // Refresh cart
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId: number) => {
    setLoading(true);
    try {
      await removeCartItemService(itemId);
      fetchCartItems(); // Refresh cart
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove cart item');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartTotal,
    getCartItemCount,
    fetchCartItems
  };
};