const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const {
  createSubmission,
  getUserSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
} = require('../controllers/submissionController');

const router = express.Router();

// Validation middleware for submission
const submissionValidation = [
  body('rep').trim().notEmpty().withMessage('Representative name is required'),
  body('relevancy').isIn(['High', 'Medium', 'Low']).withMessage('Relevancy must be High, Medium, or Low'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('whatsapp').trim().notEmpty().withMessage('WhatsApp number is required'),
  body('tier').notEmpty().withMessage('Tier is required'),
  body('volume').trim().notEmpty().withMessage('Volume is required'),
  body('submissionType').isIn(['manual', 'business_card', 'whatsapp_qr']).withMessage('Invalid submission type')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.post('/', submissionValidation, createSubmission);
router.get('/', getUserSubmissions);
router.get('/:id', getSubmission);
router.put('/:id', updateSubmission);
router.delete('/:id', deleteSubmission);

module.exports = router;
