const { query } = require('../config/db');
const { auth, authorize } = require('../config/auth');

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = `
      SELECT p.*, c.name as category_name, u.username as seller_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN users u ON p.seller_id = u.id
    `;
    const params = [];
    
    if (category) {
      sql += ' WHERE c.name = $1';
      params.push(category);
    }
    
    const products = await query(sql, params);
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
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
    
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    const seller_id = req.user.id;
    
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    
    // Check if product exists and belongs to seller
    const product = await query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [id, req.user.id]);
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    
    const updatedProduct = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, image_url = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, description, price, stock_quantity, category_id, image_url, id]
    );
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists and belongs to seller
    const product = await query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [id, req.user.id]);
    if (!product.rows.length) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    
    await query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};