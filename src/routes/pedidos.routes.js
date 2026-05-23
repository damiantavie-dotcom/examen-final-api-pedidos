const express = require('express');
const pedidosController = require('../controllers/pedidos.controller');

const router = express.Router();

router.get('/', pedidosController.listarPedidos);
router.get('/:id', pedidosController.obtenerPedidoPorId);
router.post('/', pedidosController.crearPedido);
router.put('/:id', pedidosController.actualizarPedido);
router.delete('/:id', pedidosController.eliminarPedido);

module.exports = router;
