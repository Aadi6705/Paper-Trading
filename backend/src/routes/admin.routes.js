const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(authMiddleware, adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);

module.exports = router;
