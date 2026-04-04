const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Categoria = db.define('categoria',{
    nome:{
        type:DataTypes.STRING,
        required: true,
    },
    desconto:{
        type:DataTypes.DOUBLE,
        required:true,
    },
    pontos_necessarios:{
        type:DataTypes.DOUBLE,
        required: true,
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        required:true,
        defaultValue:true,
    }
});

module.exports = Categoria;