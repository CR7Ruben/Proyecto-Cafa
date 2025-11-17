const crypto = require('crypto');

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 150000, 32, 'sha256');
}

function encryptAES(plaintext, password) {
  const salt = crypto.randomBytes(16);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, ciphertext]).toString('base64');
}

function decryptAES(packageB64, password) {
  const pkg = Buffer.from(packageB64, 'base64');
  if (pkg.length < 44) throw new Error('Invalid package');
  const salt = pkg.slice(0,16);
  const iv = pkg.slice(16,28);
  const tag = pkg.slice(28,44);
  const ciphertext = pkg.slice(44);
  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString('utf8');
}

module.exports = { encryptAES, decryptAES };
