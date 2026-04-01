const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

//ROTAS GET
router.get('/listar', categoriaController.listarCategorias);

//ROTAS POST
router.post('/criar', categoriaController.criarCategoria);

//ROTAS PUT

//ROTAS DELETE

module.exports = router;