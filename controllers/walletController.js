const Customer = require('../models/customer');

exports.topUpWallet = async (req, res) => {
  try {
    const { id, wallet_topup } = req.body;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    customer.wallet += Number(wallet_topup);
    await customer.save();

    res.json({ message: 'Wallet topped up successfully', wallet: customer.wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};