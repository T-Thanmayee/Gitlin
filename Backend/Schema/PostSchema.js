const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: { type: String, default: null }, // URL for image or video
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  tags: [{ type: String, trim: true, lowercase: true }],
  likes: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, default: 1 } // Weight for like strength (e.g., 1 for like, 2 for love)
  }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, immutable: true }
}, { timestamps: true });

// Index for efficient querying by user and tags
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);