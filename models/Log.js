const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Log = db.define('log',{
    tabela_db: {
        type: DataTypes.STRING,
        required: true,
    },
    acao:{
        type: DataTypes.STRING(255),
        required:true,
    },
    registro_id:{
        type: DataTypes.BIGINT,
        required: true,
    },
    detalhe:{
        type:DataTypes.TEXT,
        required: true,
    }
});

module.exports = Log;