const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  phone: String,
  email: String,
  macAdress: String,
  flows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flow',
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
