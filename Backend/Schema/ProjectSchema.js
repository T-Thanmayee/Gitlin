const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    unique: true, // Ensure unique project titles
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: [50, 'Technology name cannot exceed 50 characters'],
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature description cannot exceed 100 characters'],
  }],
  lookingFor: [{
    type: String,
    trim: true,
    maxlength: [50, 'Role name cannot exceed 50 characters'],
  }],
  files: [{
    path: {
      type: String,
      required: [true, 'File path is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      maxlength: [200, 'File name cannot exceed 200 characters'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required'],
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  githubLink: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/, 'Invalid GitHub URL'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Pre-save hook to update the updatedAt timestamp
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient searching by title and description
projectSchema.index({ title: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;