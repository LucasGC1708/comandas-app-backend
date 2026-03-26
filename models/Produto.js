const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Produto = db.define('produto', {
    nome: {
        type: DataTypes.STRING,
        required: true
    },
    preco: {
        type: DataTypes.DOUBLE,
        required: true
    }
});

module.exports = Produto;