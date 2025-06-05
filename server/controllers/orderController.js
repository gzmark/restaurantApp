const Pedido = require('../models/orderModel');

const getPedidos = async (req, res) => {
  const pedidos = await Pedido.find().populate('mesero mesa productos.producto');
  res.status(200).json(pedidos);
};

const getPedidoById = async (req, res) => {
  const pedido = await Pedido.findById(req.params.id).populate('productos.producto');
  if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.status(200).json(pedido);
};

const createPedido = async (req, res) => {
  const nuevo = await Pedido.create(req.body);
  res.status(201).json(nuevo);
};

const updatePedido = async (req, res) => {
  const actualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(actualizado);
};

const deletePedido = async (req, res) => {
  await Pedido.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Pedido eliminado' });
};

const finalizarPedido = async (req, res) => {
  const finalizado = await Pedido.findByIdAndUpdate(req.params.id, { estado: 'finalizado' }, { new: true });
  res.status(200).json(finalizado);
};

module.exports = {
  getPedidos, getPedidoById, createPedido, updatePedido, deletePedido, finalizarPedido
};
