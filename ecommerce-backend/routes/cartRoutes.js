const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../config/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cartController');

router.get('/', auth, authorize(['customer', 'admin']), getCart);
router.post('/', auth, authorize(['customer', 'admin']), addToCart);
router.put('/:id', auth, authorize(['customer', 'admin']), updateCartItem);
router.delete('/:id', auth, authorize(['customer', 'admin']), removeCartItem);

module.exports = router;