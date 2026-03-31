const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController')


router.post('/criar', produtoController.criarProduto);
router.post('/criarMassa',produtoController.criarProdutoEmMassa);
router.get('/buscar/:id', produtoController.buscarProduto);
router.get('/listar', produtoController.listarProdutos);
router.post('/editar', produtoController.editarProduto);
router.post('/desativar', produtoController.desativarProduto);

module.exports = router;
