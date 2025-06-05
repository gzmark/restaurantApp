const Pago = require('../models/paymentModel');

const registrarPago = async (req, res) => {
  const nuevo = await Pago.create(req.body);
  res.status(201).json(nuevo);
};

const getPagos = async (req, res) => {
  const pagos = await Pago.find().populate('pedido');
  res.status(200).json(pagos);
};

module.exports = { registrarPago, getPagos };
