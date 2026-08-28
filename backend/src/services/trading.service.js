const prisma = require('../models/prismaClient');
const marketDataService = require('./marketData.service');
const { calculateNewAveragePrice } = require('../utils/calculations');

class TradingService {
  async placeOrder(userId, symbol, side, quantity, orderType = 'MARKET') {
    if (quantity <= 0) {
      throw this._createError('Quantity must be greater than zero', 400, 'INVALID_QUANTITY');
    }

    const stock = await marketDataService.getStockBySymbol(symbol);
    const currentPrice = stock.currentPrice;
    const totalValue = currentPrice * quantity;

    // Wrap the entire order execution in a Prisma transaction to guarantee atomicity
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw this._createError('Wallet not found', 404, 'WALLET_NOT_FOUND');

      let holding = await tx.holding.findUnique({
        where: { userId_stockId: { userId, stockId: stock.id } }
      });

      // Validations based on side
      if (side === 'BUY') {
        if (wallet.cashBalance < totalValue) {
          throw this._createError(`Insufficient funds. Need ₹${totalValue.toFixed(2)}, but have ₹${wallet.cashBalance.toFixed(2)}`, 400, 'INSUFFICIENT_FUNDS');
        }

        // Deduct cash
        await tx.wallet.update({
          where: { userId },
          data: { cashBalance: { decrement: totalValue } }
        });

        // Log transaction
        await tx.transaction.create({
          data: {
            userId,
            type: 'BUY',
            amount: totalValue,
            description: `Bought ${quantity} shares of ${stock.symbol} at ₹${currentPrice.toFixed(2)}`,
          }
        });

        // Update or create holding
        if (holding) {
          const newAvgPrice = calculateNewAveragePrice(holding.quantity, holding.averageBuyPrice, quantity, currentPrice);
          await tx.holding.update({
            where: { id: holding.id },
            data: {
              quantity: { increment: quantity },
              averageBuyPrice: newAvgPrice
            }
          });
        } else {
          await tx.holding.create({
            data: {
              userId,
              stockId: stock.id,
              quantity,
              averageBuyPrice: currentPrice
            }
          });
        }
      } else if (side === 'SELL') {
        if (!holding || holding.quantity < quantity) {
          throw this._createError(`Insufficient holdings. You only hold ${holding ? holding.quantity : 0} shares of ${stock.symbol}`, 400, 'INSUFFICIENT_HOLDINGS');
        }

        // Add cash
        await tx.wallet.update({
          where: { userId },
          data: { cashBalance: { increment: totalValue } }
        });

        // Log transaction
        await tx.transaction.create({
          data: {
            userId,
            type: 'SELL',
            amount: totalValue,
            description: `Sold ${quantity} shares of ${stock.symbol} at ₹${currentPrice.toFixed(2)}`,
          }
        });

        // Update holding
        if (holding.quantity === quantity) {
          // Fully sold, remove holding
          await tx.holding.delete({ where: { id: holding.id } });
        } else {
          await tx.holding.update({
            where: { id: holding.id },
            data: { quantity: { decrement: quantity } }
          });
        }
      } else {
        throw this._createError('Invalid order side', 400, 'INVALID_SIDE');
      }

      // Finally, create the order record
      const order = await tx.order.create({
        data: {
          userId,
          stockId: stock.id,
          orderType,
          side,
          quantity,
          price: currentPrice,
          status: 'EXECUTED', // Immediate execution for MARKET orders
          executedAt: new Date(),
        },
        include: {
          stock: true
        }
      });

      return order;
    });
  }

  async getOrders(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: { stock: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrder(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { stock: true }
    });

    if (!order || order.userId !== userId) {
      throw this._createError('Order not found', 404, 'ORDER_NOT_FOUND');
    }
    return order;
  }

  _createError(message, statusCode, code) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
  }
}

module.exports = new TradingService();
