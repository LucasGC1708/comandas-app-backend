const {Pedido, Cliente} = require('../models/Index');

module.exports = class pedidoController{

    static async criarPedido(req,res){
        try {
            
            const {cliente_id} = req.body;

            const cliente = await Cliente.findOne({where:{id:cliente_id}, raw:true});

            if(!cliente){
                return res.status(404).json({success:false, message: "Cliente não encontrado"});
            }

            const pedido = {
                cliente_id
            }

            await Pedido.create(pedido);


            res.status(201).json({success:true, message:"Pedido criado com sucesso"});
        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

}