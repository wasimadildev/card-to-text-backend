const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const {
  register,
  login,
  getProfile,
  logout,
  verifyToken
} = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
