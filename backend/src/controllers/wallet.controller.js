const walletService = require('../services/wallet.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user.id);
  res.status(200).json({ success: true, data: wallet });
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await walletService.getTransactions(req.user.id);
  res.status(200).json({ success: true, data: transactions });
});
