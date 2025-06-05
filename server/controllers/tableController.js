const Mesa = require('../models/tableModel');

const getMesas = async (req, res) => {
  const mesas = await Mesa.find();
  res.status(200).json(mesas);
};

const getMesaById = async (req, res) => {
  const mesa = await Mesa.findById(req.params.id);
  if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });
  res.status(200).json(mesa);
};

const createMesa = async (req, res) => {
  const { numero, capacidad, estado, ubicacion, observaciones, meseroAsignado } = req.body;
  const nuevaMesa = await Mesa.create({ numero, capacidad, estado, ubicacion, observaciones, meseroAsignado });
  res.status(201).json(nuevaMesa);
};

const updateMesa = async (req, res) => {
  
  const updates = { ...req.body };

    // Elimina campos no deseados o vacíos
  if (typeof updates.clientesActuales === 'undefined' || updates.estado !== 'ocupada') {
    delete updates.clientesActuales;
  }


  const mesa = await Mesa.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });
  res.status(200).json(mesa);
};

const deleteMesa = async (req, res) => {
  await Mesa.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Mesa eliminada' });
};

const cambiarEstadoMesa = async (req, res) => {
  const { estado } = req.body;
  const mesa = await Mesa.findByIdAndUpdate(req.params.id, { estado }, { new: true });
  res.status(200).json(mesa);
};

module.exports = {
  getMesas, getMesaById, createMesa, updateMesa, deleteMesa, cambiarEstadoMesa
};
