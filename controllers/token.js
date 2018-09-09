const crypto = require('crypto');
const Token = require('../models/Token');

/**
 * GET /tokens/create
 * Create a new token and send it back.
 */
exports.createToken = (req, res) => {
  const newToken = new Token({
    payload: crypto.randomBytes(16).toString('hex'),
    expiration: Date.now() + (10 * 60 * 1000),
  });

  return newToken.save((err) => {
    if (err) {
      return res.json({
        status: 'error',
        error: err,
      });
    }
    return res.json({
      status: 'succeess',
      payload: newToken,
    });
  });
};
