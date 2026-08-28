const marketDataService = require('../services/marketData.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllStocks = asyncHandler(async (req, res) => {
  const stocks = await marketDataService.getAllStocks();
  res.status(200).json({ success: true, data: stocks });
});

exports.getStock = asyncHandler(async (req, res) => {
  const stock = await marketDataService.getStockBySymbol(req.params.symbol);
  res.status(200).json({ success: true, data: stock });
});

exports.getStockHistory = asyncHandler(async (req, res) => {
  const history = await marketDataService.getStockHistory(req.params.symbol);
  res.status(200).json({ success: true, data: history });
});

exports.streamMarketData = asyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendData = async () => {
    const data = await marketDataService.getAllStocks();
    res.write(`data: ${JSON.stringify({ success: true, data })}\n\n`);
  };

  sendData();

  marketDataService.on('priceUpdate', sendData);

  req.on('close', () => {
    marketDataService.off('priceUpdate', sendData);
  });
});
