const express = require('express');
const mongoose = require('mongoose');
const Post = require('../Schema/PostSchema');
const Comment = require('../Schema/CommentSchema');
const User = require('../Schema/Users');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX allowed.'));
    }
  }
});


// Create a new post
// Create a text or media URL post

router.post('/', async (req, res) => {
  try {
    const { content, media, type, tags, userId } = req.body;
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : '667f1a2b3c4d5e6f78901234';
    const userExists = await User.findById(validUserId);
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    if (!content && !media) {
      return res.status(400).json({ error: 'Content or media URL is required' });
    }

    if (type !== 'text') {
      return res.status(400).json({ error: 'Invalid post type. Only text allowed.' });
    }

    const post = new Post({
      user: validUserId,
      content: content || null,
      media: media || null,
      type: type || 'text',
      tags: Array.isArray(tags) ? tags : []
    });
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name username avatar verified')
      .lean();
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create post', details: err.message });
  }
});

// Get user feed
router.get('/feed', async (req, res) => {
  try {
    const user = await User.findById('6849686d69aeaef02fcc09c3').select('following').lean();
    const following = Array.isArray(user?.following) ? user.following : [];
    const posts = await Post.aggregate([
      {
        $match: {
          $or: [
            { user: { $in: following } },
            { 'likes.0': { $exists: true } }
          ]
        }
      },
      {
        $addFields: {
          engagementScore: {
            $sum: [
              { $multiply: [{ $size: '$likes' }, 1] },
              { $multiply: [{ $size: '$comments' }, 2] },
              { $multiply: ['$shares', 3] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.name': 1,
          'user.username': 1,
          'user.avatar': 1,
          'user.verified': 1,
          content: 1,
          media: 1,
          type: 1,
          tags: 1,
          likes: 1,
          comments: 1,
          shares: 1,
          createdAt: 1
        }
      }
    ]);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feed', details: err.message });
  }
});

// Search posts by user name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }
    const users = await User.find({
      name: { $regex: name, $options: 'i' }
    }).select('_id').lean();
    const userIds = users.map(user => user._id);
    const posts = await Post.find({ user: { $in: userIds } })
      .populate('user', 'name username avatar verified')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search posts', details: err.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    const post = await Post.findById(req.params.id)
      .populate('user', 'name username avatar verified')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name username avatar' }
      })
      .lean();
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post', details: err.message });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const { weight = 1, userId } = req.body;
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : '667f1a2b3c4d5e6f78901234';
    const userExists = await User.findById(validUserId);
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const likeIndex = post.likes.findIndex(like => like.user.toString() === validUserId);
    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ user: validUserId, weight });
    }
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name username avatar verified')
      .lean();
    res.json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update like', details: err.message });
  }
});

// Comment on a post
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, parentComment, userId } = req.body;
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : '667f1a2b3c4d5e6f78901234';
    const userExists = await User.findById(validUserId);
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
      return res.status(400).json({ error: 'Invalid parentComment ID' });
    }
    const comment = new Comment({
      text,
      user: validUserId,
      post: post._id,
      parentComment: parentComment || null
    });
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name username avatar')
      .lean();
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to add comment', details: err.message });
  }
});
// Create a document post
router.post('/doc', upload.single('file'), async (req, res) => {
  try {
    const { content, type, tags, userId } = req.body;
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : '667f1a2b3c4d5e6f78901234';
    const userExists = await User.findById(validUserId);
    if (!userExists) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Document file is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const post = new Post({
      user: validUserId,
      content: content || 'Document upload',
      media: fileUrl,
      type: type || 'document',
      tags: tags ? JSON.parse(tags) : []
    });
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name username avatar verified')
      .lean();
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create document post', details: err.message });
  }
});
// Follow or unfollow a user
router.post('/:id/follow', async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: 'Invalid userId or target user ID' });
    }
    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    if (!user || !targetUser) {
      return res.status(404).json({ error: 'User or target user not found' });
    }

    if (!Array.isArray(user.following)) {
      user.following = [];
    }

    const isFollowing = user.following.some(id => id.toString() === targetUserId);
    if (isFollowing) {
      user.following = user.following.filter(id => id.toString() !== targetUserId);
    } else {
      user.following.push(targetUserId);
    }
    await user.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      following: user.following
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update follow status', details: err.message });
  }
});

module.exports = router;