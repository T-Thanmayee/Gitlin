const express = require('express');
const router = express.Router();
const multer = require('multer');
const Mentor = require('../Schema/Mentor');
const Message = require('../Schema/Message'); // New schema for chat messages
const mongoose = require('mongoose');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for async error handling
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET all mentors with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const { isOnline, skills } = req.query;
  const query = {};

  if (isOnline !== undefined) {
    query.isOnline = isOnline === 'true';
  }
  if (skills) {
    query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
  }

  const mentors = await Mentor.find(query).sort({ createdAt: -1 });
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

// POST create new mentor (with file and FormData)
router.post(
  '/',
  upload.single('profilePicture'),
  asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const mentor = new Mentor({
      name: req.body.name,
      shortName: req.body.shortName,
      profileImage: req.file ? req.file.buffer.toString('base64') : null,
      rating: req.body.rating,
      skills: Array.isArray(req.body['skills']) ? req.body['skills'] : [req.body['skills']],
      description: req.body.bio || req.body.description,
      experience: req.body.experience,
      price: req.body.hourlyRate,
      isOnline: false // Default to offline for new mentors
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
  mentor.isOnline = req.body.isOnline !== undefined ? req.body.isOnline : mentor.isOnline;

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

// GET chat history between user and mentor
router.get('/:shortName/chat', asyncHandler(async (req, res) => {
  const userId = req.query.userId; // Assume userId is passed as query param
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: mentor._id },
      { senderId: mentor._id, receiverId: userId }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
}));

module.exports = router;

// Socket.IO setup (to be included in main app file, but referenced here for clarity)
// This assumes the main app passes the Socket.IO instance to this router
module.exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Mentor joins their own room based on their ID
    socket.on('joinMentor', async (mentorId) => {
      try {
        const mentor = await Mentor.findById(mentorId);
        if (mentor) {
          socket.join(mentorId);
          mentor.isOnline = true;
          await mentor.save();
          io.emit('mentorStatus', { mentorId, isOnline: true });
        }
      } catch (error) {
        console.error('Error joining mentor:', error);
      }
    });

    // User joins a chat with a mentor
    socket.on('joinChat', ({ userId, mentorId }) => {
      const room = [userId, mentorId].sort().join('_'); // Unique room for user-mentor pair
      socket.join(room);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const message = new Message({
          senderId,
          receiverId,
          content,
          createdAt: new Date()
        });
        await message.save();

        const room = [senderId, receiverId].sort().join('_');
        io.to(room).emit('receiveMessage', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle mentor disconnection
    socket.on('disconnect', async () => {
      try {
        const mentor = await Mentor.findOne({ socketId: socket.id });
        if (mentor) {
          mentor.isOnline = false;
          await mentor.save();
          io.emit('mentorStatus', { mentorId: mentor._id, isOnline: false });
        }
        console.log('User disconnected:', socket.id);
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });
  });
};