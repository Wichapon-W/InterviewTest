const Order = require('../models/order');
const Customer = require('../models/customer');

const findCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new Error('Customer not found');
  return customer;
};

const calculateFinalPrice = (price, discountRate) => {
  return discountRate ? price - (price * discountRate / 100) : price;
};

const validateWalletBalance = (wallet, finalPrice) => {
  if (wallet < finalPrice) throw new Error('Insufficient wallet balance');
};

const createOrder = async (customerId, productName, price, finalPrice) => {
  const order = new Order({
    customer_id: customerId,
    product_name: productName,
    price,
    final_price: finalPrice,
  });
  await order.save();
  return order;
};

exports.purchaseProduct = async (req, res) => {
  try {
    const { id, product_name, price } = req.body;

    const customer = await findCustomerById(id);
    const finalPrice = calculateFinalPrice(price, customer.rate_discount);

    validateWalletBalance(customer.wallet, finalPrice);

    customer.wallet -= finalPrice;
    await customer.save();

    const order = await createOrder(customer._id, product_name, price, finalPrice);

    res.json({ message: 'Purchase successful', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer_id', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ customer_id: id });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};