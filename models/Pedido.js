const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Pedido = db.define('pedido', {
    cliente_id:{
        type:DataTypes.INTEGER,
        require:true
    },
});

module.exports = Pedido;