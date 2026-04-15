const express = require('express');
const router = express.Router();

const ordemVendaController = require('../controllers/ordemVendaController');

const validaToken = require('../middlewares/validaToken');

router.get('/buscar', validaToken, ordemVendaController.buscaOrdemVenda);
router.post('/finalizar', validaToken, ordemVendaController.finalizaOrdemVenda);

module.exports = router;