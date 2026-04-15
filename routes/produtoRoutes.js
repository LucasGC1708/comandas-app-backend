const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController');

const validaToken = require('../middlewares/validaToken');


router.post('/criar', validaToken, produtoController.criarProduto);
router.post('/criarMassa', validaToken,produtoController.criarProdutoEmMassa);
router.get('/buscar/:id', validaToken, produtoController.buscarProduto);
router.get('/listar', validaToken, produtoController.listarProdutos);
router.post('/editar', validaToken, produtoController.editarProduto);
router.post('/desativar', validaToken, produtoController.desativarProduto);

module.exports = router;
