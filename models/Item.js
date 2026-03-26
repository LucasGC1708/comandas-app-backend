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
    }
})

module.exports = Item;