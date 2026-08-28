const portfolioService = require('../services/portfolio.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await portfolioService.getPortfolio(req.user.id);
  res.status(200).json({ success: true, data: portfolio });
});
