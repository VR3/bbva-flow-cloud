const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  payload: String,
  expiration: Date,
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
