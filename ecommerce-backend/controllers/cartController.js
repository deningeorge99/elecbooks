const { query } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const cartItems = await query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );
    
    res.json(cartItems.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    
    // Check if product exists
    const product = await query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is already in cart
    const existingCartItem = await query(
      'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );
    
    if (existingCartItem.rows.length) {
      // Update quantity
      await query(
        'UPDATE carts SET quantity = quantity + $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3',
        [quantity, user_id, product_id]
      );
    } else {
      // Add new cart item
      await query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [user_id, product_id, quantity]
      );
    }
    
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;
    
    // Check if cart item exists and belongs to user
    const cartItem = await query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (!cartItem.rows.length) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    await query(
      'UPDATE carts SET quantity = $1, updated_at = NOW() WHERE id = $2',
      [quantity, id]
    );
    
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if cart item exists and belongs to user
    const cartItem = await query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (!cartItem.rows.length) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    await query('DELETE FROM carts WHERE id = $1', [id]);
    
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};