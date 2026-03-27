const { where } = require('sequelize');
const {Pedido, Cliente} = require('../models/Index');

module.exports = class pedidoController{

    static async criarPedido(req,res){
        try {
            
            const {cliente_id} = req.body;

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

            await Pedido.create(pedido);


            res.status(201).json({success:true, message:"Pedido criado com sucesso"});
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

            res.status(200).json({success:true, data: pedido});    
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

            await pedidoCadastrado.update({status: "finalizado"});

            await OrdemCompra.create({
                pedido_id: pedido.id
            });

            res.status(200).json({success:true, message:"Pedido finalizado com sucesso"});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

    static async apagarPedido(req, res){
        try {
            
            const {id} = req.params;

            const pedidoCadastrado = await Pedido.findOne({where:{id}});

            if(!pedidoCadastrado){
                return res.status(404).json({success:false, message:"Pedido não foi encontrado para a exclusão"});
            }

            await pedidoCadastrado.destroy();

            res.status(200).json({success:true, message:"Pedido excluído com sucesso"});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }
}