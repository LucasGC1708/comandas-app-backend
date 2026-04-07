const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Estoque = db.define('estoque',{
    produto_id: {
        type:DataTypes.INTEGER,
        required:true
    },
    quantidade_fisica:{
        type:DataTypes.INTEGER,
        required:true,
        defaultValue:0
    },
    quantidade_reservada:{
        type:DataTypes.INTEGER,
        required:true,
        defaultValue:0
    }
});

module.exports = Estoque;