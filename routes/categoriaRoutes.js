const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const validaToken = require('../middlewares/validaToken');

//ROTAS GET
router.get('/listar', validaToken, categoriaController.listarCategorias);

//ROTAS POST
router.post('/criar', validaToken, categoriaController.criarCategoria);
router.post('/criarEmMassa', validaToken, categoriaController.criarCategoriasEmMassa);

//ROTAS PUT
router.put('/desativar', validaToken, categoriaController.desativarCategoria);
router.put('/editar', validaToken, categoriaController.editarCategoria);

//ROTAS DELETE

module.exports = router;