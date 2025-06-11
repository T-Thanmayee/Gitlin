// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // Note: Should be hashed in production
  birthday: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  linkedIn: { type: String },
  github: { type: String },
  name: { type: String,  trim: true }, // Added for Postui.jsx
  avatar: { type: String, default: '/placeholder-user.jpg' }, // Added for Postui.jsx
  verified: { type: Boolean, default: false }, // Added for Postui.jsx
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Added for feed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
