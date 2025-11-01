const { query } = require('../config/db');

const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, phone, address } = req.body;
    const user_id = req.user.id;
    
    const updatedUser = await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, address = $4, updated_at = NOW()
       WHERE id = $5 RETURNING id, username, email, first_name, last_name, phone, address, role`,
      [first_name, last_name, phone, address, user_id]
    );
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateUser };