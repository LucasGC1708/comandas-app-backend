const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Pedido = db.define('pedido', {
    cliente_id:{
        type:DataTypes.INTEGER,
        require:true
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aguardando_pagamento', 'finalizado'),
        required: true,
        defaultValue: 'pendente'
    }
});

module.exports = Pedido;