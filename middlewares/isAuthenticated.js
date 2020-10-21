const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = config.get('jwtSecret');

function isAuthenticated(req, res, next) {
  try {
    const token = req.headers['auth-token'];

    if (!token) {
      return res.status(401).json({ msg: 'No token' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Invalid token' });
      }

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    return res.status(500).send('Server error');
  }
}

module.exports = isAuthenticated;
