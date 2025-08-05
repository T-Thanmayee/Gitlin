const express = require('express');
const mongoose = require('mongoose');
const Post = require('../Schema/PostSchema');
const Comment = require('../Schema/CommentSchema');
const User = require('../Schema/Users');
const Project = require('../Schema/ProjectSchema');
const router = express.Router();

// Stats endpoint
router.post('/user', async (req, res) => {
  try {
    const user = req.body.user;
    if (!user || !user._id) return res.status(400).json({ error: 'User object with _id is required' });
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userIdObject = mongoose.Types.ObjectId.createFromHexString(user._id);

    // Total Projects Posted
    const totalProjects = await Project.countDocuments({ owner: userIdObject });
    console.log('Total Projects:', totalProjects);

    // Total Users You Follow
    const followingCount = user.following.length;
    console.log('Following Count:', followingCount);

    // Followers Count (users who follow this user)
    const followersCount = await User.countDocuments({ following: userIdObject });
    console.log('Followers Count:', followersCount);

    // Total Post Likes
    const posts = await Post.find({ user: userIdObject });
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    console.log('Total Likes:', totalLikes);

    // Joined On
    const joinDate = user.personal.joinDate || new Date().toISOString().split('T')[0];
    const monthsAgo = Math.floor((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 30));

    const stats = [
      {
        title: 'Total Projects Posted',
        value: totalProjects.toString(),
        change: `+${Math.floor(Math.random() * 5)} this month`,
        trend: 'up',
      },
      {
        title: 'Total Users You Follow',
        value: followingCount.toString(),
        change: `+${Math.floor(Math.random() * 15)} this week`,
        trend: 'up',
      },
      {
        title: 'Followers Count',
        value: followersCount.toString(),
        change: `+${Math.floor(Math.random() * 100)} this month`,
        trend: 'up',
      },
      {
        title: 'Total Post Likes',
        value: totalLikes.toString(),
        change: `+${Math.floor(Math.random() * 250)} this week`,
        trend: 'up',
      },
      {
        title: 'Joined On',
        value: new Date(joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        change: `${monthsAgo} months ago`,
        trend: 'neutral',
      },
    ];

    res.json(stats);
  } catch (error) {
    console.error('Error in /user endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Engagement endpoint
router.post('/user-engagement', async (req, res) => {
  try {
    const user = req.body.user;
    if (!user || !user._id) return res.status(400).json({ error: 'User object with _id is required' });
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userIdObject = mongoose.Types.ObjectId.createFromHexString(user._id);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const posts = await Post.aggregate([
      {
        $match: {
          user: userIdObject,
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
        $sort: { _id: 1 },
      },
    ]);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      days.push(date);
    }

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
    console.error('Error in /user-engagement endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Project categories endpoint
router.post('/project-categories', async (req, res) => {
  try {
    const user = req.body.user;
    if (!user || !user._id) return res.status(400).json({ error: 'User object with _id is required' });
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userIdObject = mongoose.Types.ObjectId.createFromHexString(user._id);
    console.log('User ID:', userIdObject);

    const projects = await Project.aggregate([
      { $match: { owner: userIdObject } },
      { $unwind: '$technologies' },
      {
        $group: {
          _id: '$technologies',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    console.log('Projects by category:', projects);

    const totalProjects = await Project.countDocuments({ owner: userIdObject });

    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    let data = projects.map((item, index) => ({
      name: item._id || 'Other',
      value: totalProjects ? Math.round((item.count / totalProjects) * 100) : 0,
      color: colors[index % colors.length],
    }));

    if (!data.length) {
      data = [
        { name: 'Web Development', value: 0, color: colors[0] },
        { name: 'Mobile Apps', value: 0, color: colors[1] },
        { name: 'AI/ML', value: 0, color: colors[2] },
        { name: 'Design', value: 0, color: colors[3] },
        { name: 'Other', value: 0, color: colors[4] },
      ];
    }

    if (data.length > 4) {
      const top4 = data.slice(0, 4);
      const other = data.slice(4).reduce(
        (acc, item) => ({
          ...acc,
          value: acc.value + item.value,
        }),
        { name: 'Other', value: 0, color: colors[4] }
      );
      data = [...top4, other].filter((item) => item.value > 0);
    }

    res.json(data);
  } catch (error) {
    console.error('Error in /project-categories endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Tag cloud endpoint
router.post('/tag-cloud', async (req, res) => {
  try {
    const user = req.body.user;
    if (!user || !user._id) return res.status(400).json({ error: 'User object with _id is required' });
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userIdObject = mongoose.Types.ObjectId.createFromHexString(user._id);
    console.log('User ID:', userIdObject);

    // Aggregate projects by technologies
    const projects = await Project.aggregate([
      { $match: { owner: userIdObject } },
      { $unwind: '$technologies' },
      {
        $group: {
          _id: '$technologies',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    console.log('Tag cloud data:', projects);

    // Map to UI format and assign sizes
    let data = projects.map((item) => {
      const count = item.count;
      let size;
      if (count >= 10) size = 'large';
      else if (count >= 5) size = 'medium';
      else size = 'small';
      return {
        name: item._id || 'Other',
        count,
        size,
      };
    });

    // If no projects, return empty array
    if (!data.length) {
      data = [];
    }

    res.json(data);
  } catch (error) {
    console.error('Error in /tag-cloud endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;