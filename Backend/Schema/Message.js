const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String, // Changed to String for testing
    required: true
  },
  receiverId: {
    type: String, // Changed to String for testing
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;