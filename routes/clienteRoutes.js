const clienteController = require('../controllers/clienteController');
const express = require('express');
const router = express.Router();

const validaToken = require('../middlewares/validaToken');

router.get('/buscar/:cpf', validaToken, clienteController.buscaClientePorCPF);
router.post('/criar', validaToken, clienteController.criarCliente);
router.put('/editar', validaToken, clienteController.editarCliente);
router.post('/desativar', validaToken, clienteController.desativaCliente);


module.exports = router;