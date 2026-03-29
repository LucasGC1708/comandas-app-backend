const {Item, Produto, Pedido} = require('../models/Index');

module.exports = class itemController{

    static async criarItem(req, res){
        try {
            
            const {produto_id, pedido_id , quantidade} = req.body;

            if(!produto_id, !pedido_id, !quantidade){
                return res.status(404).json({success:false, message:"Favor precheender todos os campos"})
            }

            const pedido = await Pedido.findOne({where:{id:pedido_id}});

            if(!pedido){
                return res.status(404).json({success:false, message: "Pedido não foi encontrado"});
            }

            const produto = await Produto.findOne({where:{id: produto_id}});

            if(!produto){
                return res.status(404).json({success: false, message: "Produto não encontrando"});
            }

            const valorTotal = produto.preco * quantidade;

            const item = {
                produto_id,
                quantidade,
                pedido_id,
                valorTotal
            };

            const novoItem = await Item.create(item);

            await pedido.increment('valorPedido', {
                by: valorTotal
            });

            res.status(201).json({success: true, message:"Item criado com sucesso", data:novoItem});

        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Erro no servidor"});
        }
    }

    static async buscaItem(req, res){
        try {
            
            const id = req.params.id;

            const item = await Item.findOne({where:{id},include:[{
                association:'produto',
                attributes:['id', 'nome', 'preco']
            }]});

            if(!item){
                res.status(404).json({success:false, message:"Item não foi encontrado"});
            }

            res.status(200).json({success:true, message:"Produto encontrado com sucesso" , data:item});


        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

    static async removerItem(req, res){
        try {
            
            const {id} = req.body;

            const itemCadastrado = await Item.findOne({where:{id}});

            if(!itemCadastrado){
                return res.status(400).json({success:false, message:"Item não foi encontrado"});
            }

            if(itemCadastrado.pedido_id == null){
                return res.status(400).json({success:false, message:"Item não possui pedido para ser removido"});
            }

            const pedidoCadastrado = await Pedido.findOne({where:{id:itemCadastrado.pedido_id,status:"pendente"}});

            if(!pedidoCadastrado){
                return res.status(400).json({success:false, message:"Pedido associado ao item não encontrado ou finalizado"});
            }

            const deletarItem = await itemCadastrado.destroy();

            await pedidoCadastrado.decrement('valorPedido', {
                by: itemCadastrado.valorTotal
            });

            res.status(200).json({success:true, message:"Item removido com sucesso", data:deletarItem});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }
}