const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/purchase', orderController.purchaseProduct);
router.get('/all', orderController.getAllOrders);
router.get('/customer/:id', orderController.getOrdersByCustomer);

module.exports = router;