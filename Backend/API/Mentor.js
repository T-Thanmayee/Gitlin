const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Mentor = require('../Schema/Mentor');
const Message = require('../Schema/Message');
const User = require('../Schema/Users');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware to convert userId to mentorId
const mentorIdMiddleware = asyncHandler(async (req, res, next) => {
  console.log('mentorIdMiddleware - req.path:', req.path, 'req.params:', req.params, 'req.body:', req.body, 'req.query:', req.query);
  if (req.path.startsWith('/mentors/') || req.path.startsWith('/mentormessages/')) {
    let userId = req.params.userId || req.body.userId || req.query.userId || req.user?.id;
    console.log('mentorIdMiddleware - extracted userId:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(403).json({ error: 'User is not a registered mentor' });
    }

    req.mentorId = mentor._id.toString();
    console.log('mentorIdMiddleware - set req.mentorId:', req.mentorId);
    next();
  } else {
    next();
  }
});

// Apply middleware to all routes
router.use(mentorIdMiddleware);

// Check if user is a mentor
router.get('/is-mentor/:userId', asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid User ID format' });
  }
  const mentor = await Mentor.findOne({ userId });
  res.json({ isMentor: !!mentor });
}));

// Get mentor by userId
router.get('/mentors/:userId', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  res.json(mentor);
}));

router.get('/mentors/shortName/:shortName', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  res.json(mentor);
}));

router.post(
  '/',
  upload.single('profilePicture'),
  asyncHandler(async (req, res) => {
    const userId = req.body.userId || req.user?.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    const existingMentor = await Mentor.findOne({ userId });
    if (existingMentor) {
      return res.status(400).json({ message: 'User is already a mentor' });
    }

    const mentor = new Mentor({
      userId, // Now required
      name: req.body.name,
      shortName: req.body.shortName,
      profileImage: req.file ? req.file.buffer.toString('base64') : null,
      rating: req.body.rating || 0,
      skills: Array.isArray(req.body['skills']) ? req.body['skills'] : [req.body['skills']],
      description: req.body.bio || req.body.description,
      experience: req.body.experience,
      price: req.body.hourlyRate,
      isOnline: false,
      reviews: [],
    });

    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  })
);

router.put('/mentors/:userId', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  mentor.name = req.body.name || mentor.name;
  mentor.profileImage = req.body.profileImage || mentor.profileImage;
  mentor.skills = req.body.skills || mentor.skills;
  mentor.description = req.body.description || mentor.description;
  mentor.experience = req.body.experience || mentor.experience;
  mentor.price = req.body.price || mentor.price;
  mentor.isOnline = req.body.isOnline !== undefined ? req.body.isOnline : mentor.isOnline;

  const updatedMentor = await mentor.save();
  res.json(updatedMentor);
}));

router.delete('/mentors/:userId', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  await mentor.deleteOne();
  res.json({ message: 'Mentor deleted successfully' });
}));

router.post('/mentors/:userId/reviews', asyncHandler(async (req, res) => {
  const { userId, name, rating, comment } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid User ID format' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const review = {
    userId,
    name,
    rating: parseInt(rating),
    comment,
    date: new Date(),
  };

  mentor.reviews.push(review);
  await mentor.save();

  res.status(201).json(review);
}));

router.get('/mentors/:userId/reviews', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  res.json(mentor.reviews);
}));

router.get('/mentors/:userId/chat', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid User ID format' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const mentor = await Mentor.findById(req.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: req.mentorId },
      { senderId: req.mentorId, receiverId: userId },
    ],
  }).sort({ createdAt: 1 });

  const formattedMessages = messages.map((msg) => ({
    id: msg._id.toString(),
    senderId: msg.senderId.toString(),
    senderName: msg.senderId.toString() === userId ? 'You' : mentor.name,
    message: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString(),
    isOwn: msg.senderId.toString() === userId,
  }));

  res.json(formattedMessages);
}));

router.get('/mentormessages/:userId/users', asyncHandler(async (req, res) => {
  const mentorId = req.mentorId;

  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const userMessages = await Message.aggregate([
    {
      $match: {
        $or: [{ receiverId: mentorId }, { senderId: mentorId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $addFields: {
        otherUserId: {
          $cond: [{ $eq: ['$senderId', mentorId] }, '$receiverId', '$senderId'],
        },
      },
    },
    {
      $group: {
        _id: '$otherUserId',
        latestMessage: { $first: '$content' },
        latestMessageTime: { $first: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        let: { uid: { $toObjectId: '$_id' } },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$uid'] } } }],
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        email: '$user.personal.email',
        latestMessage: 1,
        latestMessageTime: 1,
      },
    },
  ]);

  res.json(userMessages);
}));

// Socket.IO setup (updated to use mentorId)
module.exports.setupSocket = (io) => {
  const mentorNamespace = io.of('/mentor-chat');
  mentorNamespace.on('connection', (socket) => {
    console.log('A user connected to /mentor-chat:', socket.id);

    socket.on('joinMentor', async (userId, callback) => {
      try {
        if (!mongoose.isValidObjectId(userId)) {
          console.error('Invalid userId:', userId);
          return callback?.({ status: 'error', error: 'Invalid userId' });
        }
        const mentor = await Mentor.findOne({ userId });
        if (!mentor) {
          return callback?.({ status: 'error', error: 'Mentor not found' });
        }
        socket.join(mentor._id.toString());
        mentor.isOnline = true;
        await mentor.save();
        mentorNamespace.emit('mentorStatus', { mentorId: mentor._id, isOnline: true });
        callback?.({ status: 'success' });
      } catch (error) {
        console.error('Error joining mentor:', error);
        callback?.({ status: 'error', error: error.message });
      }
    });

    socket.on('joinChat', async ({ userId, mentorUserId }, callback) => {
      try {
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(mentorUserId)) {
          console.error('Invalid userId or mentorUserId:', { userId, mentorUserId });
          return callback?.({ status: 'error', error: 'Invalid IDs' });
        }
        const mentor = await Mentor.findOne({ userId: mentorUserId });
        if (!mentor) {
          return callback?.({ status: 'error', error: 'Mentor not found' });
        }
        const room = [userId, mentor._id.toString()].sort().join('_');
        socket.join(room);
        callback?.({ status: 'success', room });
      } catch (error) {
        console.error('Error joining chat:', error);
        callback?.({ status: 'error', error: error.message });
      }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, content, tempId, debugId }, callback) => {
      console.log(`Received sendMessage (debugId: ${debugId}) on /mentor-chat:`, { senderId, receiverId, content });
      try {
        if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(receiverId)) {
          throw new Error('Invalid senderId or receiverId');
        }

        const sender = await User.findById(senderId) || await Mentor.findById(senderId);
        const receiver = await User.findById(receiverId) || await Mentor.findById(receiverId);

        if (!sender || !receiver) {
          throw new Error('Sender or receiver not found');
        }

        const existingMessage = await Message.findOne({
          senderId,
          receiverId,
          content,
          createdAt: { $gte: new Date(Date.now() - 1000) },
        });
        if (existingMessage) {
          console.log(`Duplicate message detected (debugId: ${debugId}) on /mentor-chat`);
          return callback?.({ status: 'error', error: 'Duplicate message' });
        }

        const message = new Message({
          senderId,
          receiverId,
          content,
          createdAt: new Date(),
        });
        await message.save();

        const messageData = {
          _id: message._id,
          senderId: message.senderId.toString(),
          receiverId: message.receiverId.toString(),
          content: message.content,
          timestamp: message.createdAt,
          tempId,
        };

        const room = [senderId, receiverId].sort().join('_');
        mentorNamespace.to(room).emit('receiveMessage', messageData);

        callback?.({ status: 'success', message: messageData });
      } catch (error) {
        console.error(`Error sending message (debugId: ${debugId}) on /mentor-chat:`, error);
        callback?.({ status: 'error', error: error.message });
      }
    });

    socket.on('disconnect', async () => {
      try {
        const mentor = await Mentor.findOne({ socketId: socket.id });
        if (mentor) {
          mentor.isOnline = false;
          await mentor.save();
          mentorNamespace.emit('mentorStatus', { mentorId: mentor._id, isOnline: false });
        }
        console.log('User disconnected from /mentor-chat:', socket.id);
      } catch (error) {
        console.error('Error on disconnect from /mentor-chat:', error);
      }
    });
  });
};

module.exports.router = router;