const mongoose = require('mongoose');

// Mentor Schema
const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: '/placeholder.svg'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  skills: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mentor Model
const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;