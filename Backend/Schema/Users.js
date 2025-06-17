// models/User.js
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
});

const personalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String },
  company: { type: String },
  location: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  website: { type: String },
  avatar: { type: String, default: '/placeholder.svg?height=150&width=150' },
  coverImage: { type: String, default: '/placeholder.svg?height=300&width=1200' },
  bio: { type: String },
  joinDate: { type: String },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // Note: Should be hashed in production
  birthday: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  linkedIn: { type: String },
  github: { type: String },
  verified: { type: Boolean, default: false },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  personal: personalSchema, // Embedded personal schema
  education: [educationSchema], // Array of education entries
  experience: [experienceSchema], // Array of experience entries
  skills: [{ type: String }], // Array of skills
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);