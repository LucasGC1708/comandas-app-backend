const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Produto = db.define('produto', {
    nome: {
        type: DataTypes.STRING,
        required: true
    },
    sku:{
        type: DataTypes.INTEGER,
        required:true,
        unique:true,
    },
    preco: {
        type: DataTypes.DOUBLE,
        required: true,
        defaultValue:0.00
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        required: true,
        defaultValue:true
    }
});

module.exports = Produto;