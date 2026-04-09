const express = require('express');
const router = express.Router();

const estoqueController = require('../controllers/estoqueController');

//get
router.get('/buscar', estoqueController.buscarTodosEstoques);
router.get('/buscar/:produtoId', estoqueController.buscarEstoquePorProduto);
//post
router.post('/criar', estoqueController.criarEstoque);
//update
router.put('/adicionarQuantidade', estoqueController.adicionarQuantidade);

module.exports = router;