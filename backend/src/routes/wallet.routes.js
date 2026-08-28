const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', walletController.getWallet);
router.get('/transactions', walletController.getTransactions);

module.exports = router;
