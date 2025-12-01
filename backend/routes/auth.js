const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Session } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXPIRATION || '2h';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

function parseJwtExpToMs(exp) {
  if (exp.endsWith('h')) return parseInt(exp) * 3600 * 1000;
  if (exp.endsWith('m')) return parseInt(exp) * 60 * 1000;
  return 2 * 3600 * 1000;
}

/* REGISTER */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ error: 'User exists' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, passwordHash: hash });

    return res.json({ ok: true, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Register error' });
  }
});

/* LOGIN */
router.post('/login', async (req, res) => {
  try {
    const { username, password, tabToken } = req.body;

    if (!username || !password || !tabToken)
      return res.status(400).json({ error: 'Missing fields (include tabToken)' });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid creds' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid creds' });

    const jti = uuidv4();
    const token = jwt.sign({ sub: user.id, jti }, JWT_SECRET, { expiresIn: JWT_EXP });

    const expiresAt = new Date(Date.now() + parseJwtExpToMs(JWT_EXP));

    await Session.create({
      id: uuidv4(),
      userId: user.id,
      tabToken,
      jwtId: jti,
      expiresAt
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: expiresAt.getTime() - Date.now()
    });

    return res.json({ ok: true });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: 'Login error' });
  }
});

/* LOGOUT */
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      await Session.destroy({ where: { jwtId: payload.jti } });
    }

    res.clearCookie(COOKIE_NAME);
    return res.json({ ok: true });

  } catch (e) {
    res.clearCookie(COOKIE_NAME);
    return res.json({ ok: true });
  }
});

module.exports = router;
