const orderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    product_name: String,
    price: Number,
    final_price: Number,
    date: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Order', orderSchema);