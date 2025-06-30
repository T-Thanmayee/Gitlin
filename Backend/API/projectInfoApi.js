const express = require('express');
const router = express.Router();
const Project = require('../Schema/ProjectSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../Schema/Users'); 
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


router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, technologies, features, lookingFor, githubLink,user } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    let fileObjects=null
    if(req.files){
        fileObjects = req.files.map(file => ({
      path: file.path,
      originalName: file.originalname,
      size: file.size,
    }) ) ;
    }
    

    const project = new Project({
      title,
      description,
      technologies: JSON.parse(technologies || '[]'),
      features: JSON.parse(features || '[]'),
      lookingFor: JSON.parse(lookingFor || '[]'),
      githubLink,
      owner: user,
      files: fileObjects,
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/projects/search
// Search projects by title or description
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const projects = await Project.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/projects/user/:userId
// Get projects by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({ owner: userId })
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Make sure path is correct

router.get('/recommend/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skills = user.skills || [];
    const educationKeywords = (user.education || []).map(e => `${e.field} ${e.degree}`).join(' ');

    // Step 2: Construct query
    const query = {
      $or: [
        { technologies: { $in: skills } },
        { lookingFor: { $in: skills } },
        { description: { $regex: educationKeywords, $options: 'i' } },
        { title: { $regex: educationKeywords, $options: 'i' } }
      ]
    };

    // Step 3: Fetch projects
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Add a collaborator to a project
router.put('/:projectId/collaborators', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { collaboratorId } = req.body;

    if (!collaboratorId) {
      return res.status(400).json({ message: 'Collaborator ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Avoid duplicates
    if (project.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    project.collaborators.push(collaboratorId);
    await project.save();

    res.status(200).json({ message: 'Collaborator added successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;