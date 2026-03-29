const {Pedido, Cliente, OrdemVenda} = require('../models/Index');

module.exports = class pedidoController{

    static async criarPedido(req,res){
        try {
            
            const {cliente_id} = req.body;

            if(!cliente_id){
                return res.status(400).json({success:false, message:"Favor informar o cliente do pedido"});
            }

            const cliente = await Cliente.findOne({where:{id:cliente_id}, raw:true});

            if(!cliente){
                return res.status(404).json({success:false, message: "Cliente não encontrado"});
            }
            
            const pedidoPendente = await Pedido.findAll({
                where:{cliente_id, status:"pendente"},
                attributes:{exclude:['createdAt', 'updatedAt']}
            });

            if(pedidoPendente.length > 0){
                return res.status(400).json({success:false, message:"O cliente em questão tem um pedido pendente em seu nome", pendente:pedidoPendente});
            }

            const pedido = {
                cliente_id
            }

            const novoPedido = await Pedido.create(pedido);


            res.status(201).json({success:true, message:"Pedido criado com sucesso", data:novoPedido});
        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

    static async buscarPedido(req, res){

        try {
            const id = req.params.id;

            const pedido = await Pedido.findOne({where:{id},include:[{
                    association:'itens',
                    attributes:['quantidade','valorTotal'],
                    include:[{
                        association: 'produto',
                        attributes: ['id', 'nome', 'preco']
                    }]
                }]
            });

            if(!pedido){
                return res.status(404).json({success:false, message: "Pedido não foi encontrado"});
            }

            res.status(200).json({success:true, message:"Pedido encontrado com sucesso", data: pedido});    
        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
        
    }

    static async finalizarPedido(req, res){
        try {
            
            const {id} = req.params;

            const pedidoCadastrado = await Pedido.findOne({where:{id}});

            if(!pedidoCadastrado){
                return res.status(404).json({success:false, message:"Pedido não foi encontrado"});
            }

            if(pedidoCadastrado.status === "finalizado"){
                return res.status(400).json({success:false, message:"Pedido já foi finalizado"});
            }

            const itens = await pedidoCadastrado.getItens();

            if(itens.length === 0){
                return res.status(400).json({success:false, message:"Pedido não possui itens"});
            }

            const finalizacaoPedido = await pedidoCadastrado.update({status: "finalizado"});

            await OrdemVenda.create({
                pedido_id: pedidoCadastrado.id
            });

            res.status(200).json({success:true, message:"Pedido finalizado com sucesso", data: finalizacaoPedido});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

    static async apagarPedido(req, res){
        try {
            
            const {id} = req.body;

            const pedidoCadastrado = await Pedido.findOne({where:{id}});

            if(!pedidoCadastrado){
                return res.status(404).json({success:false, message:"Pedido não foi encontrado para a exclusão"});
            }

            const ordemDePedido = OrdemVenda.findOne({where:{pedido_id:pedidoCadastrado.id, status:"entregue"},raw:true});

            if(ordemDePedido){
                return res.status(400).json({success:false, message:"Este pedido não pode mais ser excluído pois sua ordem de venda já foi finalizada"});
            }

            const exclusaoPedido = await pedidoCadastrado.destroy();

            res.status(200).json({success:true, message:"Pedido excluído com sucesso", data:exclusaoPedido});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }
}