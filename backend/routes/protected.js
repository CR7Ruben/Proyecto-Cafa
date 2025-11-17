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

    let payload;
    try { payload = jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }

    const session = await Session.findOne({ where: { jwtId: payload.jti } });
    if (!session) return res.status(401).json({ error: 'Session not found' });

    if (new Date(session.expiresAt) < new Date()) {
      await Session.destroy({ where: { jwtId: payload.jti } });
      return res.status(401).json({ error: 'Session expired' });
    }

    const clientTabToken = req.get('x-tab-token');
    if (!clientTabToken) return res.status(401).json({ error: 'Missing x-tab-token' });

    if (clientTabToken !== session.tabToken) return res.status(401).json({ error: 'Session invalid for this tab' });

    req.userId = payload.sub;
    req.session = session;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Auth error' });
  }
}

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.userId, { attributes: ['id','username','createdAt'] });
  res.json({ user });
});

router.post('/encrypt', authMiddleware, async (req, res) => {
  try {
    const { plaintext, passwordKey } = req.body;
    if (!plaintext || !passwordKey) return res.status(400).json({ error: 'Missing fields' });
    const ciphertext = encryptAES(plaintext, passwordKey);
    res.json({ ciphertext });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Encrypt error' });
  }
});

router.post('/decrypt', authMiddleware, async (req, res) => {
  try {
    const { ciphertext, passwordKey } = req.body;
    if (!ciphertext || !passwordKey) return res.status(400).json({ error: 'Missing fields' });
    try {
      const plaintext = decryptAES(ciphertext, passwordKey);
      res.json({ plaintext });
    } catch (e) {
      return res.status(400).json({ error: 'Decrypt failed' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Decrypt error' });
  }
});

module.exports = router;
