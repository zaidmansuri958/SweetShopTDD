import jwt from 'jsonwebtoken';

// Basic token auth middleware
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sweetsecret');
    req.user = decoded; // Attach decoded user (with role) to request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Admin-only route guard
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};


