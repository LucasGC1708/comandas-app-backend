const {Item, Produto, Pedido} = require('../models/Index');
const {formataPreco} = require('../utils/helpers');
const db = require('../db/conn');

module.exports = class itemController{

    static async criarItem(req, res){
        const {produto_id, pedido_id , quantidade} = req.body;

        if(!produto_id || !pedido_id || !quantidade){
            return res.status(400).json({success:false, message:"Favor precheender todos os campos"})
        }

        const t = await db.transaction();
        
        try {

            const pedido = await Pedido.findOne({where:{id:pedido_id}, transaction: t, lock: t.LOCK.UPDATE});

            if(!pedido){
                await t.rollback();
                return res.status(404).json({success:false, message: "Pedido não foi encontrado"});
            }

            if(pedido.status !== 'pendente'){
                await t.rollback();
                return res.status(400).json({success:false, message: "Pedido já foi finalizado"});
            }

            const produto = await Produto.findOne({where:{id: produto_id}, transaction: t});

            if(!produto){
                await t.rollback();
                return res.status(404).json({success: false, message: "Produto não encontrando"});
            }

            const valorTotal = formataPreco(produto.preco * quantidade);

            const item = {
                produto_id,
                quantidade,
                pedido_id,
                valorTotal
            };

            const novoItem = await Item.create(item,{transaction: t});

            await pedido.increment('valorPedido', {
                by: valorTotal,
                transaction: t
            });

            await t.commit();

            return res.status(201).json({success: true, message:"Item criado com sucesso", data:novoItem});

        } catch (err) {
            if(!t.finished){
                await t.rollback();
            }
            console.log(err);
            return res.status(500).json({message: "Erro no servidor"});
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
        
        const {id} = req.body;

        if(!id){
                return res.status(400).json({success:false, message:"Informar item para ser removido"});
            }

        const t = await db.transaction();

        try {

            const itemCadastrado = await Item.findOne({where:{id},transaction: t, lock: t.LOCK.UPDATE});

            if(!itemCadastrado){
                await t.rollback();
                return res.status(404).json({success:false, message:"Item não foi encontrado"});
            }

            if(itemCadastrado.pedido_id == null){
                await t.rollback();
                return res.status(400).json({success:false, message:"Item não possui pedido para ser removido"});
            }

            const pedidoCadastrado = await Pedido.findOne({where:{id:itemCadastrado.pedido_id,status:"pendente"},transaction: t, lock: t.LOCK.UPDATE});

            if(!pedidoCadastrado){
                await t.rollback();
                return res.status(400).json({success:false, message:"Pedido associado ao item não encontrado ou finalizado"});
            }

            const deletarItem = await itemCadastrado.destroy({transaction: t});

            await pedidoCadastrado.decrement('valorPedido', {
                by: itemCadastrado.valorTotal,
                transaction: t
            });

            await t.commit();

            return res.status(200).json({success:true, message:"Item removido com sucesso", data:deletarItem});

        } catch (err) {
            if(!t.finished){
                await t.rollback();
            }
            console.log(err);
            return res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }
}