const clienteController = require('../controllers/clienteController');
const express = require('express');
const router = express.Router();

router.get('/buscar/:cpf', clienteController.buscaClientePorCPF);
router.post('/criar', clienteController.criarCliente);
router.put('/editar', clienteController.editarCliente);
router.post('/desativar', clienteController.desativaCliente);


module.exports = router;