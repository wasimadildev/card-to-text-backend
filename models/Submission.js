const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // User who submitted the data
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  
  // Representative information
  rep: {
    type: String,
    required: [true, 'Representative name is required'],
    trim: true
  },
  
  // Relevancy/Priority
  relevancy: {
    type: String,
    required: [true, 'Relevancy is required'],
    trim: true
  },
  
  // Company Information
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  
  // Contact Person Details
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  
  // Business Details
  partnerDetails: [{
    type: String,
    trim: true
  }],
  
  targetRegions: [{
    type: String,
    trim: true
  }],
  
  lob: [{
    type: String,
    trim: true
  }],
  
  tier: {
    type: String,
    required: [true, 'Tier is required'],
    trim: true
  },
  
  grades: [{
    type: String,
    trim: true
  }],
  
  volume: {
    type: String,
    required: [true, 'Volume is required'],
    trim: true
  },
  
  addAssociates: {
    type: String,
    trim: true,
    default: ''
  },
  
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  
  // File attachments
  businessCardUrl: {
    type: String,
    default: ''
  },
  
  // Timestamps
  submittedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: true
});

// Indexes for better query performance
submissionSchema.index({ userId: 1 });
submissionSchema.index({ companyName: 1 });
submissionSchema.index({ submittedAt: -1 });

// Compound indexes
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ companyName: 1, userId: 1 });

// Virtual for full contact name
submissionSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Static method to get submissions by user
submissionSchema.statics.findByUser = function(userId, limit = null) {
  const query = this.find({ userId }).sort({ createdAt: -1 });
  return limit ? query.limit(limit) : query;
};

// Static method to get submissions by company
submissionSchema.statics.findByCompany = function(companyName) {
  return this.find({ 
    companyName: { $regex: companyName, $options: 'i' } 
  }).sort({ createdAt: -1 });
};

// Static method to get unique companies for a user
submissionSchema.statics.getUniqueCompanies = function(userId) {
  return this.distinct('companyName', { userId });
};

// Static method to get monthly submissions for a user
submissionSchema.statics.getMonthlySubmissions = function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  return this.find({
    userId,
    submittedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ submittedAt: -1 });
};

// Instance method to format for export
submissionSchema.methods.toExportFormat = function() {
  const submittedDate = this.submittedAt ? new Date(this.submittedAt) : new Date();
  return {
    'Submission Date': submittedDate.toLocaleDateString(),
    'Representative': this.rep,
    'Relevancy': this.relevancy,
    'Company Name': this.companyName,
    'First Name': this.firstName,
    'Last Name': this.lastName,
    'Email': this.email,
    'Phone': this.phone,
    'WhatsApp': this.whatsapp,
    'Partner Details': this.partnerDetails.join(', '),
    'Target Regions': this.targetRegions.join(', '),
    'Line of Business': this.lob.join(', '),
    'Tier': this.tier,
    'Grades': this.grades.join(', '),
    'Volume': this.volume,
    'Additional Associates': this.addAssociates,
    'Notes': this.notes
  };
};

module.exports = mongoose.model('Submission', submissionSchema);
