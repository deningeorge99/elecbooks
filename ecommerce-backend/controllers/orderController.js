const { query } = require('../config/db');

const placeOrder = async (req, res) => {
  try {
    const { shipping_address, phone, payment_method } = req.body;
    const user_id = req.user.id;
    
    // Get cart items
    const cartItems = await query(
      `SELECT c.product_id, c.quantity, p.price, p.name 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );
    
    if (!cartItems.rows.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    
    // Calculate total amount
    const total_amount = cartItems.rows.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Create order
    const newOrder = await query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, phone, payment_method)
       VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING id`,
      [user_id, total_amount, shipping_address, phone, payment_method]
    );
    
    const order_id = newOrder.rows[0].id;
    
    // Add order items
    const orderItemsPromises = cartItems.rows.map(item => {
      return query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order_id, item.product_id, item.quantity, item.price]
      );
    });
    
    await Promise.all(orderItemsPromises);
    
    // Clear cart
    await query('DELETE FROM carts WHERE user_id = $1', [user_id]);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order_id,
      total_amount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const orders = await query(
      `SELECT o.*, 
              json_agg(json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price_at_purchase', oi.price_at_purchase,
                'product_name', p.name
              )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user_id]
    );
    
    res.json(orders.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getOrderHistory };