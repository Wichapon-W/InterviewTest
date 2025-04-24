const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ['income', 'expense'] },
    amount: Number,
    date: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Transaction', transactionSchema);