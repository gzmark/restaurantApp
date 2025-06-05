const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  numero: { type: Number, unique: true, required: true },
  capacidad: { type: Number, required: true },
  estado: { type: String, enum: ['disponible', 'ocupada', 'reservada'], default: 'disponible' },
  ubicacion: { type: String, enum: ['interior', 'terraza', 'salon-privado', 'barra'], default: 'interior' },
  meseroAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  observaciones: { type: String, default: '' }
});

module.exports = mongoose.model('Table', tableSchema);
