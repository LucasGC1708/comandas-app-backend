const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

router.post('/criar', pedidoController.criarPedido);
router.get('/buscar/:id', pedidoController.buscarPedido);
router.post('/finalizar/:id', pedidoController.finalizarPedido);
router.post('/apagar', pedidoController.apagarPedido);

module.exports = router;