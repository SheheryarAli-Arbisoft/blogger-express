const express = require('express');
const { check, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { isAuthenticated } = require('../middlewares');

const router = express.Router();

// Get all blogs
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Get a single blog
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Create a blog
router.post(
  '/',
  [
    isAuthenticated,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      const blog = new Blog({
        user: req.user.id,
        title,
        description,
      });

      await blog.save();
      res.json({ msg: 'Blog created successfully' });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// Update a blog
router.put(
  '/:id',
  [
    isAuthenticated,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      await Blog.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title,
            description,
          },
        }
      );

      res.json({ msg: 'Blog updated successfully' });
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// Delete a blog
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Blog.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Blog deleted successfully' });
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

module.exports = router;
