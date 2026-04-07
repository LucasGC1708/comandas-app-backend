const Produto = require('./Produto');
const Estoque = require('./Estoque')
const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Item = require('./Item');
const OrdemVenda = require('./OrdemVenda');
const Categoria = require('./Categoria');
const Log = require('./Log');

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

Produto.hasMany(Estoque,{
    foreignKey: "produto_id",
    as:'estoque'
});

//RELAÇÕES ESTOQUE
Estoque.belongsTo(Produto,{
    foreignKey:"produto_id",
    as:'produto'
});

//RELAÇÕES CLIENTE
Cliente.hasMany(Pedido,{
    foreignKey:"cliente_id",
    as:'pedidos'
});

Cliente.belongsTo(Categoria,{
    foreignKey:"categoria_id",
    as:'categoria',
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

//RELAÇÕES CATEGORIAS
Categoria.hasMany(Cliente,{
    foreignKey:"categoria_id",
    as:'clientes',
});



module.exports = {Cliente, Categoria, Produto, Estoque, Item, Pedido, OrdemVenda, Log};