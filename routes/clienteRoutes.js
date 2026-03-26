const clienteController = require('../controllers/clienteController');
const express = require('express');
const router = express.Router();

router.get('/busca/:cpf', clienteController.buscaClientePorCPF);
router.post('/criar', clienteController.criarCliente);


module.exports = router;