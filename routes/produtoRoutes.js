const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController')


router.post('/criar', produtoController.criarProduto);
router.get('/buscar/:id', produtoController.buscarProduto);

module.exports = router;
