const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getSystemStats();
  res.status(200).json({ success: true, data: stats });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});
