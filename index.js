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

//ROUTES
const clienteRoutes = require('./routes/clienteRoutes');

//USES
app.use('/clientes', clienteRoutes);

conn
    .sync()
        .then(()=> app.listen(port))
        .catch((err)=>console.log(err))

