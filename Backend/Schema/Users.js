// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  linkedIn: { type: String },
  github: { type: String },
});

module.exports = mongoose.model('User', userSchema);
