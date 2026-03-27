const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const OrdemCompra = db.define('ordem_compra',{
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

module.exports = OrdemCompra;