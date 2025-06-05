const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'mesero'], required: true },
  telefono: String,
  fechaNacimiento: Date,
  mesasAsignadas: [String], // Números de mesa
  turno: { type: String, enum: ['mañana', 'tarde', 'noche'] },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
});

module.exports = mongoose.model('Staff', staffSchema);
