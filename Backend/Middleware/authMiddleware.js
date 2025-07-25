const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('Auth Middleware Triggered',req.headers.authorization );
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ltk242111');
    req.user = decoded; // Attach user data (userId, email, name) to request
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;