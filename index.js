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
const Cliente = require('./models/Cliente');
const Produto = require('./models/Produto');

//ROUTES
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

//USES
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);

conn
    .sync()
    //.sync({force:true})
        .then(()=> app.listen(port))
        .catch((err)=>console.log(err))

