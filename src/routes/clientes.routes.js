const express = require('express');
const clientesController = require('../controllers/clientes.controller');

const router = express.Router();

router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.obtenerClientePorId);
router.get('/:id/pedidos', clientesController.listarPedidosDeCliente);
router.post('/', clientesController.crearCliente);
router.put('/:id', clientesController.actualizarCliente);
router.delete('/:id', clientesController.eliminarCliente);

module.exports = router;
