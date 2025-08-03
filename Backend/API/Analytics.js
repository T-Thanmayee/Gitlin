const express = require('express');


const Post = require('../Schema/PostSchema');
const Comment = require('../Schema/CommentSchema');
const User = require('../Schema/Users');
const Project = require('../Schema/ProjectSchema');
const router = express.Router();

router.post('/user', async (req, res) => {
    console.log('Analytics request received for user:', req.body.user);
  try {
    const user = req.body.user;
    console.log('User ID:', user._id);

    // Total Projects Posted
    const totalProjects = await Project.countDocuments({ owner: user._id });
    console.log('Total Projects:', totalProjects);
    // Total Users You Follow
    const followingCount = user.following.length;
    console.log('Following Count:', followingCount);
    // Followers Count (users who follow this user)
    const followersCount = await User.countDocuments({ following: user._id });
    console.log('Followers Count:', followersCount);
    // Total Post Likes
    const posts = await Post.find({ user: user._id });
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    console.log('Total Likes:', totalLikes);
    // Joined On
   
    // Calculate changes (simplified for this example)
    const stats = [
      {
        title: 'Total Projects Posted',
        value: totalProjects.toString(),
        change: `+${Math.floor(Math.random() * 5)} this month`, // Replace with actual logic
        trend: 'up',
      },
      {
        title: 'Total Users You Follow',
        value: followingCount.toString(),
        change: `+${Math.floor(Math.random() * 15)} this week`, // Replace with actual logic
        trend: 'up',
      },
      {
        title: 'Followers Count',
        value: followersCount.toString(),
        change: `+${Math.floor(Math.random() * 100)} this month`, // Replace with actual logic
        trend: 'up',
      },
      {
        title: 'Total Post Likes',
        value: totalLikes.toString(),
        change: `+${Math.floor(Math.random() * 250)} this week`, // Replace with actual logic
        trend: 'up',
      },
     
    ];

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/user-engagement', async (req, res) => {
  try {
    const user = req.body.user;
    const endDate = new Date(); // Today
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6); // Last 7 days

    // Aggregate posts by day
    const posts = await Post.aggregate([
      {
        $match: {
          user: user._id,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          likes: { $sum: { $size: '$likes' } },
          comments: { $sum: { $size: '$comments' } },
          shares: { $sum: '$shares' },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);

    // Generate array of last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      days.push(date);
    }

    // Map posts to days, filling in zeros for days with no data
    const data = days.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const post = posts.find((p) => p._id === dateStr) || { likes: 0, comments: 0, shares: 0 };
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;