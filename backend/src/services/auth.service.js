const bcrypt = require('bcrypt');
const prisma = require('../models/prismaClient');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register(name, email, password) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      error.code = 'USER_EXISTS';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const STARTING_BALANCE = 1000000; // ₹10,00,000

    // Wrap user, wallet, and transaction creation in an atomic Prisma transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      await tx.wallet.create({
        data: {
          userId: newUser.id,
          cashBalance: STARTING_BALANCE,
        }
      });

      await tx.transaction.create({
        data: {
          userId: newUser.id,
          type: 'INITIAL_DEPOSIT',
          amount: STARTING_BALANCE,
          description: 'Starting virtual balance',
        }
      });

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };
    });

    const token = generateToken(user.id);
    return { user, token };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = generateToken(user.id);
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return { user: userWithoutPassword, token };
  }

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user;
  }
}

module.exports = new AuthService();
