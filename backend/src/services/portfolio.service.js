const prisma = require('../models/prismaClient');
const marketDataService = require('./marketData.service');

class PortfolioService {
  async getPortfolio(userId) {
    const holdings = await prisma.holding.findMany({
      where: { userId },
      include: { stock: true },
      orderBy: { createdAt: 'desc' }
    });

    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    let totalInvested = 0;
    let currentPortfolioValue = 0;

    const enrichedHoldings = holdings.map(holding => {
      const livePrice = marketDataService.currentPrices[holding.stock.symbol] || holding.averageBuyPrice;
      
      const investedValue = holding.quantity * holding.averageBuyPrice;
      const currentValue = holding.quantity * livePrice;
      const pnl = currentValue - investedValue;
      const pnlPercent = (pnl / investedValue) * 100;

      totalInvested += investedValue;
      currentPortfolioValue += currentValue;

      return {
        id: holding.id,
        stockId: holding.stockId,
        symbol: holding.stock.symbol,
        companyName: holding.stock.companyName,
        quantity: holding.quantity,
        averageBuyPrice: holding.averageBuyPrice,
        currentPrice: livePrice,
        investedValue,
        currentValue,
        pnl,
        pnlPercent
      };
    });

    const totalPnl = currentPortfolioValue - totalInvested;
    const netWorth = (wallet ? wallet.cashBalance : 0) + currentPortfolioValue;

    return {
      holdings: enrichedHoldings,
      summary: {
        cashBalance: wallet ? wallet.cashBalance : 0,
        totalInvested,
        currentPortfolioValue,
        totalPnl,
        netWorth
      }
    };
  }
}

module.exports = new PortfolioService();
