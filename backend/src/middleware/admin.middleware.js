const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    const error = new Error('Admin access required');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    next(error);
  }
};

module.exports = adminMiddleware;
