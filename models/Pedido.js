const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Pedido = db.define('pedido', {
    cliente_id:{
        type:DataTypes.INTEGER,
        require:true
    },
    numero_pedido:{
        type: DataTypes.INTEGER,
        required:true,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aguardando_pagamento', 'finalizado'),
        required: true,
        defaultValue: 'pendente'
    },
    valorPedido: {
        type: DataTypes.DOUBLE,
        required: true,
        defaultValue:0.00
    },
    pontos_calculados:{
        type:DataTypes.DOUBLE,
        required:true,
        defaultValue:0
    }
});

module.exports = Pedido;