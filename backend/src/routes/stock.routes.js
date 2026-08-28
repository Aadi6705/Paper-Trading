const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protect all stock routes
router.use(authMiddleware);

router.get('/', stockController.getAllStocks);
router.get('/stream', stockController.streamMarketData);
router.get('/:symbol', stockController.getStock);
router.get('/:symbol/history', stockController.getStockHistory);

module.exports = router;
