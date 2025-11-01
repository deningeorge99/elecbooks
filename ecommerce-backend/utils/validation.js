const Joi = require('joi');

const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'seller').required(),
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    phone: Joi.string().max(20),
    address: Joi.string()
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

module.exports = { validateRegister, validateLogin };