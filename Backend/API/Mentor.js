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

router.get('/', asyncHandler(async (req, res) => {
  const { isOnline, skills, rating, price } = req.query;
  const query = {};

  if (isOnline !== undefined) {
    query.isOnline = isOnline === 'true';
  }
  if (skills) {
    query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
  }
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }
  if (price) {
    if (price.includes('-')) {
      const [min, max] = price.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    } else {
      query.price = { $gte: parseInt(price) };
    }
  }

  const mentors = await Mentor.find(query).sort({ createdAt: -1 });
  res.json(mentors);
}));



router.get('/:mentorId', asyncHandler(async (req, res) => {
  console.log("called me...")
  const mentor = await Mentor.findById(req.params.mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }
  res.json(mentor);
}));
router.get('/:shortName', asyncHandler(async (req, res) => {
  
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
    const mentor = new Mentor({
      name: req.body.name,
      shortName: req.body.shortName,
      profileImage: req.file ? req.file.buffer.toString('base64') : null,
      rating: req.body.rating,
      skills: Array.isArray(req.body['skills']) ? req.body['skills'] : [req.body['skills']],
      description: req.body.bio || req.body.description,
      experience: req.body.experience,
      price: req.body.hourlyRate,
      isOnline: false,
    });

    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  })
);

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

router.delete('/:shortName', asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  await mentor.deleteOne();
  res.json({ message: 'Mentor deleted successfully' });
}));

router.get('/:shortName/chat', asyncHandler(async (req, res) => {
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

  const mentor = await Mentor.findOne({ shortName: req.params.shortName });
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: mentor._id },
      { senderId: mentor._id, receiverId: userId },
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

router.get('/:mentorId/messages/users', asyncHandler(async (req, res) => {
  const { mentorId } = req.params;

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

module.exports.setupSocket = (io) => {
  const mentorNamespace = io.of('/mentor-chat');
  mentorNamespace.on('connection', (socket) => {
    console.log('A user connected to /mentor-chat:', socket.id);

    socket.on('joinMentor', async (mentorId) => {
      try {
        if (!mongoose.isValidObjectId(mentorId)) {
          console.error('Invalid mentorId:', mentorId);
          return;
        }
        const mentor = await Mentor.findById(mentorId);
        if (mentor) {
          socket.join(mentorId);
          mentor.isOnline = true;
          await mentor.save();
          mentorNamespace.emit('mentorStatus', { mentorId, isOnline: true });
        }
      } catch (error) {
        console.error('Error joining mentor:', error);
      }
    });

    socket.on('joinChat', ({ userId, mentorId }) => {
      if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(mentorId)) {
        console.error('Invalid userId or mentorId:', { userId, mentorId });
        return;
      }
      const room = [userId, mentorId].sort().join('_');
      socket.join(room);
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

        // Check for duplicate message
        const existingMessage = await Message.findOne({
          senderId,
          receiverId,
          content,
          timestamp: { $gte: new Date(Date.now() - 1000) },
        });
        if (existingMessage) {
          console.log(`Duplicate message detected (debugId: ${debugId}) on /mentor-chat`);
          if (typeof callback === 'function') {
            callback({ status: 'error', error: 'Duplicate message' });
          }
          return;
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

        if (typeof callback === 'function') {
          callback({ status: 'success', message: messageData });
        }
      } catch (error) {
        console.error(`Error sending message (debugId: ${debugId}) on /mentor-chat:`, error);
        if (typeof callback === 'function') {
          callback({ status: 'error', error: error.message });
        }
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