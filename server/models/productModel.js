const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, enum: ['comida', 'bebida', 'postre', 'entrada'], required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
  imagen: String
});

module.exports = mongoose.model('Product', productSchema);
