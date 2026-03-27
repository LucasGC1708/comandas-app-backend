const Produto = require('./Produto');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Item = require('./Item');

//RELAÇÕES ITEM 
Item.belongsTo(Produto, {
    foreignKey: "produto_id",
    as: 'produto'
});

Item.belongsTo(Pedido, {
    foreignKey:"pedido_id",
    as:"pedido"
});



//RELAÇOES PRODUTO 

Produto.hasMany(Item,{
    foreignKey: "produto_id"
});

//RELAÇÕES CLIENTE
Cliente.hasMany(Pedido,{
    foreignKey:"cliente_id"
});

//RELAÇÕES PEDIDO
Pedido.belongsTo(Cliente,{
    foreignKey:"cliente_id",
    as:'cliente'
});

Pedido.hasMany(Item,{
    foreignKey:"pedido_id",
});



module.exports = {Cliente, Produto, Item, Pedido};