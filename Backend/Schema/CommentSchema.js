const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // For threaded replies
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('Comment', commentSchema);