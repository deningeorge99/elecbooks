const { query } = require('../config/db');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name');
    res.json(categories.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (!category.rows.length) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newCategory = await query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    
    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const category = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (!category.rows.length) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const updatedCategory = await query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    
    res.json({
      message: 'Category updated successfully',
      category: updatedCategory.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (!category.rows.length) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await query('DELETE FROM categories WHERE id = $1', [id]);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};