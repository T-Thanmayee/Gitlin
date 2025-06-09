// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../Schema/Users');

// @POST /users/register
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
