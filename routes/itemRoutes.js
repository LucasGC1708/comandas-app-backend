const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

router.post('/criar', itemController.criarItem);
router.get('/buscar/:id', itemController.buscaItem);
router.post('/editar', itemController.editarItem);
router.post('/remover', itemController.removerItem);

module.exports = router;