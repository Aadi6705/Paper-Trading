const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const walletRoutes = require('./routes/wallet.routes');
const stockRoutes = require('./routes/stock.routes');
const tradingRoutes = require('./routes/trading.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', tradingRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;
