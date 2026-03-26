const express = require('express');
const app = express();
const conn = require('./db/conn');

const port = 3000;


//MODELS DB
const Cliente = require('./models/Cliente');

//ROUTES
const clienteRoutes = require('./routes/clienteRoutes');

//USES
app.use('/clientes', clienteRoutes);

app.use(
    express.urlencoded(
        {
            extended:true,
        }
    )
);

app.use(express.json());

conn
    .sync()
        .then(()=> app.listen(port))
        .catch((err)=>console.log(err))

