const { z } = require('zod');

exports.orderSchema = z.object({
  symbol: z.string({ required_error: 'Symbol is required' }).min(1),
  side: z.enum(['BUY', 'SELL'], { required_error: 'Side must be BUY or SELL' }),
  quantity: z.number({ required_error: 'Quantity is required' }).int().positive('Quantity must be positive'),
  orderType: z.enum(['MARKET']).optional().default('MARKET'),
});
