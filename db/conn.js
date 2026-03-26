const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('comandas','root','123456',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = sequelize;