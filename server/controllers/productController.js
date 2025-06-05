const Producto = require('../models/productModel');

const getProductos = async (req, res) => {
  const productos = await Producto.find();
  res.status(200).json(productos);
};

const getProductoById = async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
  res.status(200).json(producto);
};

const createProducto = async (req, res) => {
  const nuevo = await Producto.create(req.body);
  res.status(201).json(nuevo);
};

const updateProducto = async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(producto);
};

const deleteProducto = async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Producto eliminado' });
};

module.exports = {
  getProductos, getProductoById, createProducto, updateProducto, deleteProducto
};
