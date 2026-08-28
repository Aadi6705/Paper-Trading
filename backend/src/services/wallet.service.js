const prisma = require('../models/prismaClient');

class WalletService {
  async getWallet(userId) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      const error = new Error('Wallet not found');
      error.statusCode = 404;
      error.code = 'WALLET_NOT_FOUND';
      throw error;
    }

    return wallet;
  }

  async getTransactions(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  }
}

module.exports = new WalletService();
