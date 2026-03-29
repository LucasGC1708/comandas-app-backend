const Log = require('../models/Log');

async function registrarLog({tabela_db, acao, registro_id, detalhe}) {
    try {
        
        await Log.create({
            tabela_db,
            acao,
            registro_id,
            detalhe
        });

    } catch (err) {
        console.log("Error no registro de log: ", err);
    }
}

module.exports = registrarLog;