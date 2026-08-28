const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', portfolioController.getPortfolio);

module.exports = router;
