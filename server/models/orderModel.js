const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  mesero: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  mesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      cantidad: { type: Number, required: true }
    }
  ],
  total: Number,
  estado: { type: String, enum: ['activo', 'finalizado'], default: 'activo' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
