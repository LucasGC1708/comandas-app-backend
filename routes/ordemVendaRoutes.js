const express = require('express');
const router = express.Router();

const ordemVendaController = require('../controllers/ordemVendaController');

router.get('/buscar', ordemVendaController.buscaOrdemVenda);
router.post('/finalizar', ordemVendaController.finalizaOrdemVenda);

module.exports = router;