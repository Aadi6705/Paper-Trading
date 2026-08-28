const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/trading.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { orderSchema } = require('../validators/trading.validator');

router.use(authMiddleware);

router.post('/', validate(orderSchema), tradingController.placeOrder);
router.get('/', tradingController.getOrders);
router.get('/:id', tradingController.getOrder);

module.exports = router;
