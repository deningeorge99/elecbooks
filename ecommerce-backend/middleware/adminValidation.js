const Joi = require('joi');

// Validate user creation
const validateUserCreation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'seller', 'admin').required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().optional()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

// Validate product creation
const validateProductCreation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    stock_quantity: Joi.number().integer().min(0).required(),
    category_id: Joi.number().integer().positive().required(),
    seller_id: Joi.number().integer().positive().required(),
    image_url: Joi.string().uri().optional()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

// Validate order status update
const validateOrderStatusUpdate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  next();
};

module.exports = {
  validateUserCreation,
  validateProductCreation,
  validateOrderStatusUpdate
};