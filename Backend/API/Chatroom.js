const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming User.js is in models folder
const Message = mongoose.model('Message'); // Assuming Message model is already defined elsewhere

const router = express.Router();

module.exports = function initializeChat(server) {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000', // Adjust to match your frontend URL (e.g., Next.js default port)
      methods: ['GET', 'POST'],
    },
  });

  // Store online users
  const onlineUsers = new Map(); // Map<userId, socketId>

  // Socket.IO Connection
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User login
    socket.on('userLogin', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('userStatus', { userId, status: 'online' });
    });

    // User disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit('userStatus', { userId: disconnectedUserId, status: 'offline' });
      }
      console.log('Client disconnected:', socket.id);
    });

    // Handle typing indicator
    socket.on('typing', ({ senderId, receiverId, isTyping }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId, receiverId, isTyping });
      }
    });

    // Handle private messages
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const message = new Message({
          sender: senderId,
          receiver: receiverId,
          content,
          read: false, // Assuming your Message schema has a 'read' field
        });
        await message.save();

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', {
            _id: message._id,
            senderId,
            receiverId,
            content,
            timestamp: message.timestamp,
            read: message.read,
          });
        }

        // Emit to sender for confirmation
        io.to(socket.id).emit('receiveMessage', {
          _id: message._id,
          senderId,
          receiverId,
          content,
          timestamp: message.timestamp,
          read: message.read,
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Mark messages as read
    socket.on('markMessagesRead', async ({ userId, receiverId }) => {
      try {
        await Message.updateMany(
          { sender: receiverId, receiver: userId, read: false },
          { $set: { read: true } }
        );
        io.emit('messagesRead', { userId, receiverId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });
  });

  // Route to get followers with online/offline status and unread count
  router.get('/users/:userId/followers', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
        .populate('following', 'username personal.name personal.title personal.avatar')
        .select('following');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const followersWithStatus = await Promise.all(user.following.map(async (follower) => {
        const unreadCount = await Message.countDocuments({
          sender: follower._id,
          receiver: req.params.userId,
          read: false,
        });
        const lastMessage = await Message.findOne({
          $or: [
            { sender: follower._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: follower._id },
          ],
        })
          .sort({ timestamp: -1 })
          .select('content timestamp');

        return {
          id: follower._id,
          name: follower.personal.name,
          title: follower.personal.title,
          avatar: follower.personal.avatar,
          isOnline: onlineUsers.has(follower._id.toString()),
          lastMessage: lastMessage ? lastMessage.content : '',
          lastMessageTime: lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString() : '',
          unreadCount,
          isTyping: false,
        };
      }));

      res.json(followersWithStatus);
    } catch (error) {
      console.error('Error fetching followers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Route to get chat history between two users
  router.get('/messages/:userId/:receiverId', async (req, res) => {
    try {
      const { userId, receiverId } = req.params;
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
      })
        .populate('sender', 'username personal.name personal.avatar')
        .sort('timestamp');

      res.json(messages.map((msg) => ({
        id: msg._id,
        senderId: msg.sender._id,
        senderName: msg.sender.personal.name,
        message: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        isOwn: msg.sender._id.toString() === userId,
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};