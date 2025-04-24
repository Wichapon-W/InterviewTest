const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/topup', walletController.topUpWallet);

module.exports = router;
