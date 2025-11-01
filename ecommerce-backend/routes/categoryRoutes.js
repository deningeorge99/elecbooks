const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, authorize } = require('../config/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', auth, authorize(['admin']), categoryController.createCategory);
router.put('/:id', auth, authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', auth, authorize(['admin']), categoryController.deleteCategory);

module.exports = router;