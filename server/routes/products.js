const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productController');

router.route('/')
  .get(getProductos)
  .post(createProducto);

router.route('/:id')
  .get(getProductoById)
  .put(updateProducto)
  .delete(deleteProducto);

module.exports = router;
