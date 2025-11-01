const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT id, username, email, role, first_name, last_name, phone, address, created_at FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await query('SELECT id, username, email, role, first_name, last_name, phone, address, created_at FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name, phone, address } = req.body;
    
    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = await query(
      `INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, role, first_name, last_name, phone, address, created_at`,
      [username, email, hashedPassword, role, first_name, last_name, phone, address]
    );
    
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, first_name, last_name, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const updatedUser = await query(
      `UPDATE users 
       SET username = $1, email = $2, role = $3, first_name = $4, last_name = $5, phone = $6, address = $7, updated_at = NOW()
       WHERE id = $8 RETURNING id, username, email, role, first_name, last_name, phone, address, updated_at`,
      [username, email, role, first_name, last_name, phone, address, id]
    );
    
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id`
    );
    res.json(products.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.id = $1`,
      [id]
    );
    
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id, seller_id, image_url } = req.body;
    
    // Create product
    const newProduct = await query(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, seller_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, stock_quantity, category_id, seller_id, image_url]
    );
    
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, seller_id, image_url } = req.body;
    
    // Check if product exists
    const existingProduct = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product
    const updatedProduct = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, seller_id = $6, image_url = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, description, price, stock_quantity, category_id, seller_id, image_url, id]
    );
    
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product
    await query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await query(
      `SELECT o.*, u.first_name || ' ' || u.last_name as user_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await query(
      `SELECT o.*, u.first_name || ' ' || u.last_name as user_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );
    
    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get order items
    const orderItems = await query(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );
    
    const orderData = {
      ...order.rows[0],
      items: orderItems.rows
    };
    
    res.json(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if order exists
    const existingOrder = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (existingOrder.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    const updatedOrder = await query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total users
    const totalUsersResult = await query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);
    
    // Get total products
    const totalProductsResult = await query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(totalProductsResult.rows[0].count);
    
    // Get total orders
    const totalOrdersResult = await query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(totalOrdersResult.rows[0].count);
    
    // Get total revenue
    const totalRevenueResult = await query('SELECT SUM(total_amount) FROM orders');
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].sum) || 0;
    
    // Get new users this month
    const newUsersThisMonthResult = await query(
      "SELECT COUNT(*) FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)"
    );
    const newUsersThisMonth = parseInt(newUsersThisMonthResult.rows[0].count);
    
    // Get new orders this month
    const newOrdersThisMonthResult = await query(
      "SELECT COUNT(*) FROM orders WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)"
    );
    const newOrdersThisMonth = parseInt(newOrdersThisMonthResult.rows[0].count);
    
    // Get revenue this month
    const revenueThisMonthResult = await query(
      "SELECT SUM(total_amount) FROM orders WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)"
    );
    const revenueThisMonth = parseFloat(revenueThisMonthResult.rows[0].sum) || 0;
    
    // Get revenue last month
    const revenueLastMonthResult = await query(
      "SELECT SUM(total_amount) FROM orders WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE)"
    );
    const revenueLastMonth = parseFloat(revenueLastMonthResult.rows[0].sum) || 0;
    
    // Get top products
    const topProductsResult = await query(
      `SELECT 
        p.id, 
        p.name, 
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5`
    );
    
    // Get recent orders
    const recentOrdersResult = await query(
      `SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.first_name || ' ' || u.last_name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5`
    );
    
    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      newUsersThisMonth,
      newOrdersThisMonth,
      revenueThisMonth,
      revenueLastMonth,
      topProducts: topProductsResult.rows,
      recentOrders: recentOrdersResult.rows
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;