const express = require('express');
const router = express.Router();
const {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  finalizarPedido
} = require('../controllers/orderController');

router.route('/')
  .get(getPedidos)
  .post(createPedido);

router.route('/:id')
  .get(getPedidoById)
  .put(updatePedido)
  .delete(deletePedido);

router.put('/:id/finalizar', finalizarPedido);

module.exports = router;
