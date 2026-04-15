const express = require('express');
const router = express.Router();

const estoqueController = require('../controllers/estoqueController');

const validaToken = require('../middlewares/validaToken');

//get
router.get('/buscar', validaToken, estoqueController.buscarTodosEstoques);
router.get('/buscar/:produtoId', validaToken, estoqueController.buscarEstoquePorProduto);
//post
router.post('/criar', validaToken, estoqueController.criarEstoque);
//update
router.put('/adicionarQuantidade', validaToken, estoqueController.adicionarQuantidade);

module.exports = router;