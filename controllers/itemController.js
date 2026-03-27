const {Item, Produto, Pedido} = require('../models/Index');

module.exports = class itemController{

    static async criarItem(req, res){
        try {
            
            const {produto_id, pedido_id , quantidade} = req.body;

            const pedido = await Pedido.findOne({where:{id:pedido_id}});

            if(!pedido){
                res.status(404).json({success:false, message: "Pedido não foi encontrado"});
            }

            const produto = await Produto.findOne({where:{id: produto_id}});

            if(!produto){
                res.status(404).json({success: false, message: "Produto não encotrando"});
            }

            const valorTotal = produto.preco * quantidade;

            const item = {
                produto_id,
                quantidade,
                pedido_id,
                valorTotal
            };

            await Item.create(item);

            res.status(201).json({success: true, item});

        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Erro no servidor"});
        }
    }

    static async buscaItem(req, res){
        try {
            
        } catch (err) {
            
        }
    }
}