const prisma = require('../models/prismaClient');

class AdminService {
  async getSystemStats() {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalTransactions = await prisma.transaction.count();
    
    const orders = await prisma.order.findMany({ where: { status: 'EXECUTED' }});
    const totalVolume = orders.reduce((acc, order) => acc + (order.quantity * order.price), 0);

    return {
      totalUsers,
      totalOrders,
      totalTransactions,
      totalVolume
    };
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        wallet: { select: { cashBalance: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = new AdminService();
