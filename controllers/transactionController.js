const Transaction = require('../models/transaction');

const buildTransactionFilter = (startDate, endDate, type) => {
  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (type) {
    filter.type = type;
  }
  return filter;
};

const calculateBalance = (transactions) => {
  return transactions.reduce((total, item) => {
    return item.type === 'income' ? total + item.amount : total - item.amount;
  }, 0);
};

exports.addTransaction = async (req, res) => {
  try {
    const { title, type, amount, date } = req.body;
    const transaction = new Transaction({ title, type, amount, date });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const filter = buildTransactionFilter(startDate, endDate, type);
    const transactions = await Transaction.find(filter);

    const balance = calculateBalance(transactions);

    res.json({ balance, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};