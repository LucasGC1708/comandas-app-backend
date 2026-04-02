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
    categoria_id:{
        type: DataTypes.INTEGER,
        required:true,
    },
    pontos:{
        type:DataTypes.DECIMAL,
        required:true,
        defaultValue:0
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        required: true,
        defaultValue:true
    }
});

module.exports = Cliente;