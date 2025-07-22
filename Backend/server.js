const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const authMiddleware = require('./Middleware/authMiddleware'); // Import auth middleware
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://solid-sniffle-4jqqqqx79prv3j74w-5173.app.github.dev',
        'https://literate-space-guide-9766rwg7rj5wh97qx-5173.app.github.dev',
        'http://localhost:5173',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || '*');
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

// CORS configuration for Express
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://solid-sniffle-4jqqqqx79prv3j74w-5173.app.github.dev',
      'https://literate-space-guide-9766rwg7rj5wh97qx-5173.app.github.dev',
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || '*');
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Explicitly handle OPTIONS preflight requests
app.options('*', cors());

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
const mentorsRouter = require('./API/Mentor'); // MentorChat module
const chatroom = require('./API/Chatroom'); // LinkedInChat module

app.use('/user',usersInfo);
app.use('/projects', authMiddleware,projectInfo);
app.use('/post',authMiddleware, postInfo);
app.use('/mentors', mentorsRouter.router); // Use mentorsRouter.router
app.use('/chat', authMiddleware,chatroom(io)); // Pass io to chatroom

// Initialize Socket.IO for mentor routes
mentorsRouter.setupSocket(io);

// Serve static files from Uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

server.listen(port, () => console.log(`Web server running on port ${port}`));