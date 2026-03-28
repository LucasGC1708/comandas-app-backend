const Produto = require('./Produto');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Item = require('./Item');
const OrdemVenda = require('./OrdemVenda');

//RELAÇÕES ITEM 
Item.belongsTo(Produto, {
    foreignKey: "produto_id",
    as: 'produto'
});

Item.belongsTo(Pedido, {
    foreignKey:"pedido_id",
    as:"pedido",
    onDelete: 'CASCADE'
});

//RELAÇOES PRODUTO 

Produto.hasMany(Item,{
    foreignKey: "produto_id",
    as:'itens'
});

//RELAÇÕES CLIENTE
Cliente.hasMany(Pedido,{
    foreignKey:"cliente_id",
    as:'pedidos'
});

//RELAÇÕES PEDIDO
Pedido.belongsTo(Cliente,{
    foreignKey:"cliente_id",
    as:'cliente'
});

Pedido.hasMany(Item,{
    foreignKey:"pedido_id",
    as:'itens',
    onDelete: 'CASCADE'
});

Pedido.hasOne(OrdemVenda,{
    foreignKey:"pedido_id",
    as:'ordem_venda',
    onDelete: 'CASCADE'
});

//RELAÇÕES ORDEMVENDA
OrdemVenda.belongsTo(Pedido, {
    foreignKey:"pedido_id",
    as:"pedido",
    onDelete: 'CASCADE'
});



module.exports = {Cliente, Produto, Item, Pedido, OrdemVenda};