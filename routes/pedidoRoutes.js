const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

const validaToken = require('../middlewares/validaToken');
const checkAuth = require("../middlewares/authMiddleware");


router.post('/criar', checkAuth, pedidoController.criarPedido);
router.get('/buscar/:id', validaToken, pedidoController.buscarPedido);
router.post('/finalizar/:id', pedidoController.finalizarPedido);
router.post('/retroceder', validaToken, pedidoController.retrocederPedido);
router.post('/apagar', validaToken, pedidoController.apagarPedido);

module.exports = router;