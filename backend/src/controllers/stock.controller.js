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
