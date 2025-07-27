const Submission = require('../models/Submission');
const User = require('../models/User');

// Create new submission
const createSubmission = async (req, res) => {
  try {
    const submissionData = {
      ...req.body,
      userId: req.user.id,
      submittedAt: new Date().toISOString()
    };

    // Validate required fields
    const requiredFields = [
      'rep', 'relevancy', 'companyName', 'firstName', 'lastName', 
      'email', 'phone', 'whatsapp', 'tier', 'volume'
    ];

    for (const field of requiredFields) {
      if (!submissionData[field] || submissionData[field].toString().trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field} is required and cannot be empty`
        });
      }
    }

    const submission = new Submission(submissionData);
    await submission.save();

    // Return submission with id field for frontend compatibility
    const responseSubmission = {
      ...submission.toObject(),
      id: submission._id.toString()
    };

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: { submission: responseSubmission }
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's submissions
const getUserSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, recent = false } = req.query;
    const userId = req.user.id;

    let query = Submission.find({ userId }).sort({ createdAt: -1 });

    if (recent === 'true') {
      query = query.limit(3);
    } else {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.skip(skip).limit(parseInt(limit));
    }

    const submissions = await query;
    const totalSubmissions = await Submission.countDocuments({ userId });
    const uniqueCompanies = await Submission.getUniqueCompanies(userId);
    
    // Get current month submissions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthlySubmissions = await Submission.countDocuments({
      userId,
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Format submissions for frontend compatibility
    const formattedSubmissions = submissions.map(sub => ({
      ...sub.toObject(),
      id: sub._id.toString()
    }));

    res.json({
      success: true,
      data: {
        submissions: formattedSubmissions,
        stats: {
          totalSubmissions,
          uniqueCompanies: uniqueCompanies.length,
          monthlySubmissions
        },
        pagination: recent === 'true' ? null : {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSubmissions / parseInt(limit)),
          totalItems: totalSubmissions
        }
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single submission
const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findOne({ 
      _id: id, 
      userId: req.user.role === 'admin' ? { $exists: true } : userId 
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: { submission }
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update submission
const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findOne({ 
      _id: id, 
      userId: req.user.role === 'admin' ? { $exists: true } : userId 
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Validate required fields
    const requiredFields = [
      'rep', 'relevancy', 'companyName', 'firstName', 'lastName', 
      'email', 'phone', 'whatsapp', 'tier', 'volume'
    ];

    for (const field of requiredFields) {
      if (req.body[field] !== undefined && 
          (!req.body[field] || req.body[field].toString().trim() === '')) {
        return res.status(400).json({
          success: false,
          message: `${field} is required and cannot be empty`
        });
      }
    }

    Object.assign(submission, req.body);
    submission.updatedAt = new Date();
    
    await submission.save();

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: { submission }
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete submission
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findOne({ 
      _id: id, 
      userId: req.user.role === 'admin' ? { $exists: true } : userId 
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    await Submission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



module.exports = {
  createSubmission,
  getUserSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
};
