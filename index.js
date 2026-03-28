require('dotenv').config();
const express = require('express');
const app = express();
const conn = require('./db/conn');

const port = 3000;

app.use(express.json());

app.use(
    express.urlencoded(
        {
            extended:true,
        }
    )
);

//MODELS DB
const {Cliente, Produto, Item, Pedido, OrdemVenda} = require('./models/Index');
// const Cliente = require('./models/Cliente');
// const Produto = require('./models/Produto');

//ROUTES
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const itemRoutes = require('./routes/itemRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const ordemVendaRoutes = require('./routes/ordemVendaRoutes');

//USES
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/itens', itemRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/ordemVenda', ordemVendaRoutes);

conn
    .sync()
    //.sync({force:true})
        .then(()=> app.listen(port))
        .catch((err)=>console.log(err))

