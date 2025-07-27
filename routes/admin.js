const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const {
  getAllUsers,
  getAllSubmissions,
  getUserDetails,
  updateSubmissionStatus,
  getDashboardStats,
  toggleUserStatus
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Validation middleware
const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'in_review'])
    .withMessage('Status must be pending, approved, rejected, or in_review'),
  body('adminNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Admin notes cannot exceed 500 characters')
];

// Routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.get('/submissions', getAllSubmissions);
router.patch('/submissions/:id/status', statusUpdateValidation, updateSubmissionStatus);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;



