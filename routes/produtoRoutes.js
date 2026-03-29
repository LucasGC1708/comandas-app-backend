const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController')


router.post('/criar', produtoController.criarProduto);
router.get('/buscar/:id', produtoController.buscarProduto);
router.post('/desativar', produtoController.desativarProduto);

module.exports = router;
