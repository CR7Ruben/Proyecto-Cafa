const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const FRONT = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
app.use(cors({ origin: FRONT, credentials: true }));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protected'));

// start
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    console.log("🔄 Connecting to database...");

    await sequelize.authenticate();
    console.log("✅ Connected to the database");

    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
})();
