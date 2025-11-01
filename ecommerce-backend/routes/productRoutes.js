const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../config/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { getAllCategories } = require('../controllers/getProductCategories');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', auth, authorize(['seller']), createProduct);
router.put('/:id', auth, authorize(['seller']), updateProduct);
router.delete('/:id', auth, authorize(['seller']), deleteProduct);
router.get('/category', auth, authorize(['seller']), getAllCategories);

module.exports = router;