const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Item = db.define('item',{
    quantidade: {
        type: DataTypes.INTEGER,
        required: true
    },
    valorTotal: {
        type: DataTypes.DOUBLE,
        required: true,
        defaultValue:0.00
    },
    produto_id:{
        type: DataTypes.INTEGER,
        required: true,
    },
    pedido_id:{
        type:DataTypes.INTEGER,
        required: true,
    }
})

module.exports = Item;