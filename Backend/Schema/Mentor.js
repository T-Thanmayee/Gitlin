const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true, unique: true },
  profileImage: { type: String },
  rating: { type: Number, default: 0 },
  skills: [{ type: String }],
  description: { type: String },
  experience: { type: Number },
  price: { type: Number },
  isOnline: { type: Boolean, default: false },
  socketId: { type: String },
  reviews: [reviewSchema],
});

// Calculate average rating before saving
mentorSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
  } else {
    this.rating = 0;
  }
  next();
});

module.exports = mongoose.model('Mentor', mentorSchema);