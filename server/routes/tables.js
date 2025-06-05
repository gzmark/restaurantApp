const express = require('express');
const router = express.Router();
const {
  getMesas,
  getMesaById,
  createMesa,
  updateMesa,
  deleteMesa,
  cambiarEstadoMesa
} = require('../controllers/tableController');

router.route('/')
  .get(getMesas)
  .post(createMesa);

router.route('/:id')
  .get(getMesaById)
  .put(updateMesa)
  .delete(deleteMesa);

router.put('/:id/estado', cambiarEstadoMesa);

module.exports = router;
