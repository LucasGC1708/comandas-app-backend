const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Cliente = db.define('cliente',{
    nome: {
        type: DataTypes.STRING,
        required:true
    },
    email: {
        type: DataTypes.STRING,
        required:true
    },
    cpf: {
        type: DataTypes.STRING,
        required:true
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        required: true,
        defaultValue:true
    }
});

module.exports = Cliente;