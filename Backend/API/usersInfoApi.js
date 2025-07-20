
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../Schema/Users'); // Adjust path as needed

const router = express.Router();

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

// Add other routes as needed
module.exports = router;