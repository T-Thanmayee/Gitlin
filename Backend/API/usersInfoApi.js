// routes/userinfoapi.js
const express = require('express');
const router = express.Router();
const User = require('../Schema/Users');
const bcrypt = require('bcryptjs');
const Post = require('../Schema/PostSchema');
// @POST /user/register
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @POST /user/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 'personal.email': email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.personal.email,
        name: user.personal.name || 'Unknown',
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key', // Use environment variable for secret
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Prepare user data to send to frontend
    const userData = {
      _id: user._id.toString(),
      email: user.personal.email,
      name: user.personal.name || 'Unknown',
      avatar: user.personal.avatar || '',
      // Add other user fields as needed
    };


    res.status(200).json({
      message: 'login successful',
      Token: token,
      data: userData,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// @GET /user/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select(
      'personal.name following personal.title personal.company personal.location personal.avatar personal.website personal.email experience'
    );
    res.status(200).json({ message: 'Users fetched successfully', data: users });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// @GET /user/search
router.get('/search', async (req, res) => {
  try {
    const { q, skills, location, company, degree, field } = req.query;
    const query = {};

    // Search by name
    if (q && q.trim()) {
      query['personal.name'] = new RegExp(q.trim(), 'i');
    }

    // Filter by skills
    if (skills && skills.trim()) {
      query.skills = { $in: skills.split(',').map((s) => new RegExp(s.trim(), 'i')) };
    }

    // Filter by location
    if (location && location.trim()) {
      query['personal.location'] = new RegExp(location.trim(), 'i');
    }

    // Filter by company
    if (company && company.trim()) {
      query['personal.company'] = new RegExp(company.trim(), 'i');
    }

    // Filter by education (degree or field)
    if (degree && degree.trim()) {
      query['education.degree'] = new RegExp(degree.trim(), 'i');
    }
    if (field && field.trim()) {
      query['education.field'] = new RegExp(field.trim(), 'i');
    }

    const users = await User.find(query).select(
      'personal.name personal.title personal.company personal.location personal.avatar personal.website personal.email experience'
    );

    res.status(200).json({ message: 'Search completed successfully', data: users });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});
// routes/userinfoapi.js
// ... (previous routes: register, login, users, search)

// @GET /user/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch posts
    const posts = await Post.find({ user: userId, type: 'post' }).select(
      'title content date likes comments image'
    );

    // Fetch projects (from Post with type: 'project')
    const projects = []

    res.status(200).json({
      message: 'User, posts, and projects fetched successfully',
      data: {
        user,
        posts,
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// @PUT /user/:userId
router.put('/:userId',  async (req, res) => {
  try {
    const { userId } = req.params;
    

    const { personal, skills, experience, education } = req.body;
    if (!personal?.name || !personal?.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.personal = personal || user.personal;
    user.skills = skills || user.skills;
    user.experience = experience || user.experience;
    user.education = education || user.education;
    await user.save();

    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;