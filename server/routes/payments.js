const express = require('express');
const router = express.Router();
const {
  registrarPago,
  getPagos
} = require('../controllers/paymentController');

router.post('/', registrarPago);
router.get('/', getPagos);

module.exports = router;
