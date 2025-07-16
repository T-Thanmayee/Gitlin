const express = require('express');
const router = express.Router();
const multer = require('multer');
const Mentor = require('../Schema/Mentor');

// Configure multer for file upload
const storage = multer.memoryStorage(); // or use diskStorage for saving to disk
const upload = multer({ storage });

// Middleware for async error handling
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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

// ✅ POST create new mentor (with file and FormData)
router.post(
  '/',
  upload.single('profilePicture'), // handle image
  asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const mentor = new Mentor({
      name: req.body.name,
      shortName: req.body.shortName,
      profileImage: req.file ? req.file.buffer.toString('base64') : null, // Or save file path if using disk
      rating: req.body.rating,
      skills: Array.isArray(req.body['skills']) ? req.body['skills'] : [req.body['skills']], // handles array or single string
      description: req.body.bio || req.body.description,
      experience: req.body.experience,
      price: req.body.hourlyRate,
    });

    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  })
);

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

module.exports = router;
