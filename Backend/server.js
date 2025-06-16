const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 4000;
const cors = require('cors');

// CORS configuration
app.use(cors({
  origin: [
    'https://literate-space-guide-9766rwg7rj5wh97qx-5173.app.github.dev', // Frontend origin
    'https://solid-sniffle-4jqqqqx79prv3j74w-5173.app.github.dev', // Alternative frontend origin
    'http://localhost:5173', // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Support cookies/auth
}));

// Explicitly handle OPTIONS preflight requests
app.options('*', cors()); // Ensure all routes respond to OPTIONS

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.mongodburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
const usersInfo = require('./API/usersInfoApi');
const projectInfo = require('./API/projectInfoApi');
const postInfo = require('./API/postInfoApi');
const tutorials = require('./API/tutorials');

app.use('/user', usersInfo);
app.use('/projectinfo', projectInfo);
app.use('/post', postInfo);
app.use('/tutorials', tutorials);

// Test route
app.get('/hello', (req, res) => {
  res.send('Welcome to the backend server');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(port, () => console.log(`Web server running on port ${port}`));