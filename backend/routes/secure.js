const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Session, User } = require('../models');
const { encryptAES, decryptAES } = require('../utils/crypto');
require('dotenv').config();

const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    let payload = jwt.verify(token, JWT_SECRET);

    const session = await Session.findOne({ where: { jwtId: payload.jti } });
    if (!session) return res.status(401).json({ error: 'Session not found' });

    const clientTabToken = req.get('x-tab-token');
    if (clientTabToken !== session.tabToken)
      return res.status(401).json({ error: 'Tab mismatch' });

    req.userId = payload.sub;
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Auth error' });
  }
}

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: ['id', 'username', 'createdAt']
  });
  res.json({ user });
});

module.exports = router;
