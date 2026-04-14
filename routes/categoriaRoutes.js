const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

//ROTAS GET
router.get('/listar', categoriaController.listarCategorias);

//ROTAS POST
router.post('/criar', categoriaController.criarCategoria);
router.post('/criarEmMassa', categoriaController.criarCategoriasEmMassa);

//ROTAS PUT
router.put('/desativar', categoriaController.desativarCategoria);
router.put('/editar', categoriaController.editarCategoria);

//ROTAS DELETE

module.exports = router;