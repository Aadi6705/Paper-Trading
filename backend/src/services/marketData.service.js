const prisma = require('../models/prismaClient');
const EventEmitter = require('events');

// Base prices for our simulated universe
const BASE_PRICES = {
  'RELIANCE': 2950.50,
  'TCS': 4100.25,
  'HDFCBANK': 1650.75,
  'INFY': 1620.00,
  'ICICIBANK': 1100.30,
  'HUL': 2450.15,
  'SBIN': 750.60,
  'BHARTIARTL': 1150.20,
  'ITC': 420.80,
  'KOTAKBANK': 1750.90,
  'LT': 3600.40,
  'AXISBANK': 1050.25,
  'ASIANPAINT': 2850.50,
  'MARUTI': 12500.00,
  'TATAMOTORS': 980.70,
};

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.currentPrices = { ...BASE_PRICES };
    this.lastUpdate = Date.now();
    
    // Simulate market movement every 5 seconds
    setInterval(() => this._simulateMarketMovement(), 5000);
  }

  _simulateMarketMovement() {
    this.lastUpdate = Date.now();
    for (const symbol in this.currentPrices) {
      // Random walk: -0.5% to +0.5%
      const volatility = 0.005; 
      const change = 1 + (Math.random() * volatility * 2 - volatility);
      let newPrice = this.currentPrices[symbol] * change;
      
      // Prevent prices from deviating too wildly from base for demo stability
      const basePrice = BASE_PRICES[symbol];
      if (newPrice > basePrice * 1.5) newPrice = basePrice * 1.5;
      if (newPrice < basePrice * 0.5) newPrice = basePrice * 0.5;

      this.currentPrices[symbol] = parseFloat(newPrice.toFixed(2));
    }
    this.emit('priceUpdate');
  }

  async getAllStocks() {
    const stocks = await prisma.stock.findMany();
    return stocks.map(stock => {
      const currentPrice = this.currentPrices[stock.symbol] || 100.00;
      const basePrice = BASE_PRICES[stock.symbol] || 100.00;
      const change = currentPrice - basePrice;
      const changePercent = (change / basePrice) * 100;
      
      return {
        ...stock,
        currentPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2))
      };
    });
  }

  async getStockBySymbol(symbol) {
    const stock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() }
    });
    
    if (!stock) {
      const error = new Error('Stock not found');
      error.statusCode = 404;
      error.code = 'STOCK_NOT_FOUND';
      throw error;
    }

    const currentPrice = this.currentPrices[stock.symbol] || 100.00;
    const basePrice = BASE_PRICES[stock.symbol] || 100.00;
    const change = currentPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      ...stock,
      currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }

  async getStockHistory(symbol) {
    const currentPrice = this.currentPrices[symbol.toUpperCase()] || 100.00;
    const history = [];
    let tempPrice = currentPrice;

    // Generate 30 mock data points
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(tempPrice.toFixed(2))
      });
      
      const step = 1 + (Math.random() * 0.04 - 0.02);
      tempPrice = tempPrice * step;
    }

    // Since we generated backwards from current to past, we need to reverse it 
    // to return chronological order.
    return history.reverse();
  }
}

module.exports = new MarketDataService();
