const {DataTypes} = require('sequelize');

const db = require('../db/conn');

const Categoria = db.define('categoria',{
    nome:{
        type:DataTypes.STRING,
        required: true,
    },
    desconto:{
        type:DataTypes.DECIMAL,
        required:true,
    },
    pontos_necessarios:{
        type:DataTypes.DECIMAL,
        required: true,
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        required:true,
        defaultValue:true,
    }
});

module.exports = Categoria;