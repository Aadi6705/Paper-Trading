const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }
    next();
  };
};

module.exports = roleMiddleware;
