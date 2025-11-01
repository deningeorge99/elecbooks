const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../config/auth');
const { placeOrder, getOrderHistory } = require('../controllers/orderController');

router.post('/', auth, authorize(['customer']), placeOrder);
router.get('/', auth, authorize(['customer']), getOrderHistory);

module.exports = router;