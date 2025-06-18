const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optional: Virtual to provide default user avatar if missing
commentSchema.virtual('userAvatar').get(function () {
  return this.user?.avatar || '/default-avatar.jpg';
});

module.exports = mongoose.model('Comment', commentSchema);