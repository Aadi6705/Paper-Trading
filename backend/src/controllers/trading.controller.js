const tradingService = require('../services/trading.service');
const asyncHandler = require('../utils/asyncHandler');

exports.placeOrder = asyncHandler(async (req, res) => {
  const { symbol, side, quantity, orderType } = req.body;
  const order = await tradingService.placeOrder(req.user.id, symbol, side, quantity, orderType);
  res.status(201).json({ success: true, data: order });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await tradingService.getOrders(req.user.id);
  res.status(200).json({ success: true, data: orders });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await tradingService.getOrder(req.user.id, req.params.id);
  res.status(200).json({ success: true, data: order });
});
