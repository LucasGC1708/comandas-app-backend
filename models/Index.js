const Produto = require('./Produto');
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Item = require('./Item');

//RELAÇÕES ITEM BELONGSTO
Item.belongsTo(Produto, {
    foreignKey: "produto_id",
    as: 'produto'
});

//RELAÇOES PRODUTO HASMANY

Produto.hasMany(Item,{
    foreignKey: "produto_id"
});

module.exports = {Cliente, Produto, Item, Pedido};