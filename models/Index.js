const Produto = require('./Produto');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Item = require('./Item');
const OrdemCompra = require('./OrdemCompra');

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

Pedido.hasOne(OrdemCompra,{
    foreignKey:"pedido_id",
    as:'ordem_compra',
    onDelete: 'CASCADE'
});

//RELAÇÕES ORDEMCOMPRA
OrdemCompra.belongsTo(Pedido, {
    foreignKey:"pedido_id",
    as:"pedido",
    onDelete: 'CASCADE'
});



module.exports = {Cliente, Produto, Item, Pedido, OrdemCompra};