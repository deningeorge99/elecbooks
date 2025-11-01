const express = require('express');
const router = express.Router();
const { auth } = require('../config/auth');
const { updateUser } = require('../controllers/userController');

router.put('/', auth, updateUser);

module.exports = router;