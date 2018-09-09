const mongoose = require('mongoose');

const flowSchema = new mongoose.Schema({
  concept: String,
  amount: String,
  expirationDate: Date,
  tokenUsed: String,
}, { timestamps: true });

const Flow = mongoose.model('Flow', flowSchema);

module.exports = Flow;
