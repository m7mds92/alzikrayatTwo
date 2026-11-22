import User from '../models/User.js';

export const requireUser = async (req, res, next) => {
  const userId = req.get('x-user-id');
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid user session' });
  }
  req.user = user;
  next();
};
