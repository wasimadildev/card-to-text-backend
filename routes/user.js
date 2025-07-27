const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const {
  getUserSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
} = require('../controllers/submissionController');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Routes (these are user-specific versions of submission routes)
router.get('/submissions', getUserSubmissions);
router.get('/submissions/:id', getSubmission);
router.put('/submissions/:id', updateSubmission);
router.delete('/submissions/:id', deleteSubmission);

module.exports = router;
