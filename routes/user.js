const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares');

const router = express.Router();
const jwtSecret = config.get('jwtSecret');

// Load the current user
router.get('/current', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Login a user
router.post(
  '/login',
  [
    check('email', 'A valid email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }

      jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        jwtSecret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

// Register a user
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'A valid email is required').isEmail().normalizeEmail(),
    check('password', 'Password must be atleast 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ msg: 'User with this email already exists' });
      }

      user = new User({
        name,
        email,
      });

      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      user.password = encryptedPassword;

      await user.save();

      jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        jwtSecret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
