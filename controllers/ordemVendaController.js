const OrdemVenda = require('../models/OrdemVenda');

module.exports = class ordemVendaController{

    static async buscaOrdemVenda(req, res){

        try {

            const pedidosAbertos = await OrdemVenda.findAll({
                where:{status: "pendente"}, 
                raw: true,
                attributes:{exclude:['createdAt', 'updatedAt']}
            });

            if(pedidosAbertos.length == 0){
                return res.status(400).json({success: false, message: "Nenhum pedido encontrado"});
            }

            res.status(200).json({success: true, message: "Pedidos encontrados", data:pedidosAbertos});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }

    }

}