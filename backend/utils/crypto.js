const crypto = require('crypto');

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 150000, 32, 'sha256');
}

function encryptAES(plaintext, password) {
  const salt = crypto.randomBytes(16);
  const key = deriveKey(Buffer.from(password), salt);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

function decryptAES(b64, password) {
  const raw = Buffer.from(b64, 'base64');
  const salt = raw.slice(0, 16);
  const iv = raw.slice(16, 28);
  const tag = raw.slice(28, 44);
  const ciphertext = raw.slice(44);

  const key = deriveKey(Buffer.from(password), salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(ciphertext, 'binary', 'utf8') + decipher.final('utf8');
}

module.exports = { encryptAES, decryptAES };
