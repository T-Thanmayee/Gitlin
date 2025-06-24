const express = require('express');
const router = express.Router();
const Project = require('../Schema/ProjectSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/projects');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all file types for simplicity
  },
});

// POST /api/projects/check-upload
// Check if project can be uploaded
router.post('/check-upload', async (req, res) => {
  try {
    const { title, files } = req.body; // Expected: files = [{ originalName, size }]

    // Validate title
    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }
    const existingProject = await Project.findOne({ title });
    if (existingProject) {
      return res.status(400).json({ message: 'Project title already exists' });
    }

    // Validate files
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: 'Files array is required' });
    }
    if (files.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 files allowed' });
    }
    for (const file of files) {
      if (!file.originalName || !file.size) {
        return res.status(400).json({ message: 'Each file must have originalName and size' });
      }
      if (file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: `File ${file.originalName} exceeds 10MB limit` });
      }
    }

    // Validate user
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    res.status(200).json({ message: 'Project can be uploaded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/projects
// Create a new project
router.post('/',  upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, technologies, features, lookingFor, githubLink } = req.body;
    const files = req.files;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Create file objects
    const fileObjects = files.map(file => ({
      path: file.path,
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    }));

    // Create project
    const project = new Project({
      title,
      description,
      technologies: technologies ? JSON.parse(technologies) : [],
      features: features ? JSON.parse(features) : [],
      lookingFor: lookingFor ? JSON.parse(lookingFor) : [],
      files: fileObjects,
      owner: req.user._id,
      githubLink,
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/projects/search
// Search projects by title or description
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const projects = await Project.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('owner', 'username avatar') // Adjust fields as per User schema
      .limit(10);

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/projects/user/:userId
// Get projects by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ owner: userId })
      .populate('owner', 'username avatar') // Adjust fields as per User schema
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;