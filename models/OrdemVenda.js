const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const OrdemVenda = db.define('ordem_venda',{
    pedido_id:{
        type: DataTypes.INTEGER,
        required: true
    },
    status: {
        type: DataTypes.ENUM('pendente', 'entregue'),
        required: true,
        defaultValue: 'pendente'
    }
});

module.exports = OrdemVenda;