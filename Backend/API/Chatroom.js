const express = require('express');
const mongoose = require('mongoose');
const User = require('../Schema/Users');
const Message = require('../Schema/Message');

const router = express.Router();

module.exports = function initializeChat(io) {
  // Use /chat namespace to isolate from MentorChat
  const chatNamespace = io.of('/chat');
  const onlineUsers = new Map(); // Map<userId, socketId>

  chatNamespace.on('connection', (socket) => {
    console.log('New client connected to /chat:', socket.id);

    socket.on('userLogin', (userId) => {
      console.log(`User logged in: ${userId} with socket ${socket.id}`);
      onlineUsers.set(userId, socket.id);
      chatNamespace.emit('userStatus', { userId, status: 'online' });
    });

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
        chatNamespace.emit('userStatus', { userId: disconnectedUserId, status: 'offline' });
      }
      console.log('Client disconnected from /chat:', socket.id);
    });

    socket.on('typing', ({ senderId, receiverId, isTyping }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        chatNamespace.to(receiverSocketId).emit('typing', { senderId, receiverId, isTyping });
      }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, content, debugId }) => {
      console.log(`Received sendMessage (debugId: ${debugId}) on /chat:`, { senderId, receiverId, content });
      try {
        // Check for duplicate message
        const existingMessage = await Message.findOne({
          senderId,
          receiverId,
          content,
          timestamp: { $gte: new Date(Date.now() - 1000) },
        });
        if (existingMessage) {
          console.log(`Duplicate message detected (debugId: ${debugId}) on /chat`);
          return;
        }

        const message = new Message({
          senderId,
          receiverId,
          content,
          read: false,
          timestamp: new Date(),
        });
        await message.save();
        console.log(`Message saved (debugId: ${debugId}) on /chat:`, message);

        const messageData = {
          _id: message._id,
          senderId,
          receiverId,
          content,
          timestamp: message.timestamp,
          read: message.read,
        };

        // Emit to receiver
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          chatNamespace.to(receiverSocketId).emit('receiveMessage', messageData);
        }

        // Emit confirmation to sender
        chatNamespace.to(socket.id).emit('messageSent', messageData);
      } catch (error) {
        console.error(`Error saving message (debugId: ${debugId}) on /chat:`, error);
      }
    });

    socket.on('markMessagesRead', async ({ userId, receiverId }) => {
      try {
        await Message.updateMany(
          { senderId: receiverId, receiverId: userId, read: false },
          { $set: { read: true } }
        );
        chatNamespace.emit('messagesRead', { userId, receiverId });
      } catch (error) {
        console.error('Error marking messages as read on /chat:', error);
      }
    });
  });

  router.get('/users/:userId/followers', async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('Fetching followers for userId:', userId);
      const user = await User.findById(userId)
        .populate('following', 'username personal.name personal.title personal.avatar')
        .select('following');

      if (!user) {
        console.log('User not found for userId:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      const followersWithStatus = await Promise.all(user.following.map(async (follower) => {
        const unreadCount = await Message.countDocuments({
          senderId: follower._id,
          receiverId: userId,
          read: false,
        });
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: follower._id, receiverId: userId },
            { senderId: userId, receiverId: follower._id },
          ],
        })
          .sort({ timestamp: -1 })
          .select('content timestamp');

        return {
          id: follower._id.toString(),
          name: follower.personal.name || 'Unknown',
          title: follower.personal.title || '',
          avatar: follower.personal.avatar || '/placeholder.svg',
          isOnline: onlineUsers.has(follower._id.toString()),
          lastMessage: lastMessage ? lastMessage.content : '',
          lastMessageTime: lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString() : '',
          unreadCount,
          isTyping: false,
        };
      }));

      console.log('Followers response:', followersWithStatus);
      res.json(followersWithStatus);
    } catch (error) {
      console.error('Error fetching followers:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  router.get('/messages/:userId/:receiverId', async (req, res) => {
    try {
      const { userId, receiverId } = req.params;
      console.log('Fetching messages between userId:', userId, 'and receiverId:', receiverId);

      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      }).sort('createdAt');

      const senderIds = [...new Set(messages.map(m => m.senderId))];
      console.log('Unique senderIds:', senderIds);

      const users = await User.find({
        _id: { $in: senderIds.map(id => new mongoose.Types.ObjectId(id)) }
      });

      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = {
          name: user.personal?.name || 'Unknown',
          avatar: user.personal?.avatar || '',
        };
      });

      const formattedMessages = messages.map((msg) => ({
        id: msg._id.toString(),
        senderId: msg.senderId,
        senderName: userMap[msg.senderId]?.name || 'Unknown',
        senderAvatar: userMap[msg.senderId]?.avatar || '',
        message: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString(),
        isOwn: msg.senderId === userId,
      }));

      console.log('Messages response:', formattedMessages);
      res.json(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
};