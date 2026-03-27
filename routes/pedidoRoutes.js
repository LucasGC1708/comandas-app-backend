const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

router.post('/criar', pedidoController.criarPedido);

module.exports = router;