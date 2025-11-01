const { query } = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM categories
    `;
    const categories = await query(sql);
    res.json(categories.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getAllCategories };