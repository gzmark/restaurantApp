const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  metodo: { type: String, enum: ['efectivo', 'tarjeta'], required: true },
  monto: { type: Number, required: true },
  status: { type: String, enum: ['pendiente', 'pagado'], default: 'pendiente' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
