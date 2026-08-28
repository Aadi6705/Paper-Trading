const { verifyToken } = require('../utils/jwt');
const prisma = require('../models/prismaClient');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      error.code = 'NO_TOKEN';
      throw error;
    }

    try {
      const decoded = verifyToken(token);
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!req.user) {
        throw new Error();
      }
      next();
    } catch (err) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
