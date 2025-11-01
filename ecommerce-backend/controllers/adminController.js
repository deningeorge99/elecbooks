const { query } = require('../config/db');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
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
    const newUsersThisMonthResult = await query(`
      SELECT COUNT(*) FROM users 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `);
    const newUsersThisMonth = parseInt(newUsersThisMonthResult.rows[0].count);

    // Get new orders this month
    const newOrdersThisMonthResult = await query(`
      SELECT COUNT(*) FROM orders 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `);
    const newOrdersThisMonth = parseInt(newOrdersThisMonthResult.rows[0].count);

    // Get revenue this month
    const revenueThisMonthResult = await query(`
      SELECT SUM(total_amount) FROM orders 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `);
    const revenueThisMonth = parseFloat(revenueThisMonthResult.rows[0].sum) || 0;

    // Get revenue last month
    const revenueLastMonthResult = await query(`
      SELECT SUM(total_amount) FROM orders 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      AND created_at < DATE_TRUNC('month', CURRENT_DATE)
    `);
    const revenueLastMonth = parseFloat(revenueLastMonthResult.rows[0].sum) || 0;

    // Get top products
    const topProductsResult = await query(`
      SELECT 
        p.id, 
        p.name, 
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months')
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 10
    `);

    // Get recent orders
    const recentOrdersResult = await query(`
      SELECT 
        o.id, 
        o.total_amount, 
        o.status, 
        o.created_at,
        u.first_name || ' ' || u.last_name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    res.json({
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        id, 
        username, 
        email, 
        role, 
        first_name, 
        last_name, 
        phone, 
        address, 
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await query(`
      SELECT 
        id, 
        username, 
        email, 
        role, 
        first_name, 
        last_name, 
        phone, 
        address, 
        created_at
      FROM users
      WHERE id = $1
    `, [id]);
    
    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name, phone, address } = req.body;
    
    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = await query(
      `INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, role, first_name, last_name, phone, address`,
      [username, email, hashedPassword, role, first_name, last_name, phone, address]
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, first_name, last_name, phone, address } = req.body;
    
    // Check if user exists
    const user = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user
    const updatedUser = await query(
      `UPDATE users 
       SET username = $1, email = $2, role = $3, first_name = $4, last_name = $5, phone = $6, address = $7, updated_at = NOW()
       WHERE id = $8 RETURNING id, username, email, role, first_name, last_name, phone, address`,
      [username, email, role, first_name, last_name, phone, address, id]
    );
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (admin only)
const getAllProducts = async (req, res) => {
  try {
    const products = await query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity, 
        p.category_id, 
        p.seller_id, 
        p.image_url, 
        p.created_at,
        c.name as category_name,
        u.first_name || ' ' || u.last_name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID (admin only)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity, 
        p.category_id, 
        p.seller_id, 
        p.image_url, 
        p.created_at,
        c.name as category_name,
        u.first_name || ' ' || u.last_name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id, seller_id, image_url } = req.body;
    
    // Create product
    const newProduct = await query(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, seller_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, stock_quantity, category_id, seller_id, image_url]
    );
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, seller_id, image_url } = req.body;
    
    // Check if product exists
    const product = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product
    const updatedProduct = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, seller_id = $6, image_url = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, description, price, stock_quantity, category_id, seller_id, image_url, id]
    );
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product
    await query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await query(`
      SELECT 
        o.id, 
        o.user_id, 
        o.total_amount, 
        o.status, 
        o.shipping_address, 
        o.phone, 
        o.payment_method, 
        o.created_at,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await query(`
          SELECT 
            oi.id, 
            oi.product_id, 
            oi.quantity, 
            oi.price_at_purchase,
            p.name as product_name
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1
        `, [order.id]);
        
        return {
          ...order,
          items: items.rows
        };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID (admin only)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await query(`
      SELECT 
        o.id, 
        o.user_id, 
        o.total_amount, 
        o.status, 
        o.shipping_address, 
        o.phone, 
        o.payment_method, 
        o.created_at,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [id]);
    
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get order items
    const items = await query(`
      SELECT 
        oi.id, 
        oi.product_id, 
        oi.quantity, 
        oi.price_at_purchase,
        p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);
    
    const orderWithItems = {
      ...order.rows[0],
      items: items.rows
    };
    
    res.json(orderWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if order exists
    const order = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!order.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    const updatedOrder = await query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};