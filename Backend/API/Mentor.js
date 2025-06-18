const express = require('express');
const router = express.Router();
const Mentor = require('../Schema/Mentor'); // Import the Mentor model

// Middleware for error handling
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
// GET all mentors
router.get('/', asyncHandler(async (req, res) => {
  const mentors = await Mentor.find().sort({ createdAt: -1 });
  res.json(mentors);
}));

// GET single mentor by shortName
router.get('/:shortName', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  res.json(mentor);
}));

// POST create new mentor
router.post('/', asyncHandler(async (req, res) => {
  const mentor = new Mentor({
    name: req.body.name,
    shortName: req.body.shortName,
    profileImage: req.body.profileImage,
    rating: req.body.rating,
    skills: req.body.skills,
    description: req.body.description,
    experience: req.body.experience,
    price: req.body.price
  });

  const newMentor = await mentor.save();
  res.status(201).json(newMentor);
}));

// PUT update mentor
router.put('/:shortName', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  mentor.name = req.body.name || mentor.name;
  mentor.profileImage = req.body.profileImage || mentor.profileImage;
  mentor.rating = req.body.rating || mentor.rating;
  mentor.skills = req.body.skills || mentor.skills;
  mentor.description = req.body.description || mentor.description;
  mentor.experience = req.body.experience || mentor.experience;
  mentor.price = req.body.price || mentor.price;

  const updatedMentor = await mentor.save();
  res.json(updatedMentor);
}));

// DELETE mentor
router.delete('/:shortName', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  await mentor.deleteOne();
  res.json({ message: 'Mentor deleted successfully' });
}));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = router;