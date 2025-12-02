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

// Configuración de CORS
const allowedOrigins = [
  'https://dixie-subhemispheric-phantasmagorianly.ngrok-free.dev',
  'http://177.227.43.252:4000',
  'http://177.227.43.252'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen no tiene permiso de CORS';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tab-token'] // 🔹 agregado
}));


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
