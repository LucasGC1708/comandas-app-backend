const { raw } = require('express');
const Produto = require('../models/Produto');

module.exports = class produtoController{

    static async criarProduto(req, res){
        try {
            
            const {nome, preco} = req.body;

            if(!nome || !preco){
                res.status(400).json({success:false, message: "Favor preenhcer todos os campos"});
            }

            if(typeof preco !== "number"){
                res.status(400).json({success:false, message: "Favor preenhcer preco com número"});
            }

            const produto = {
                nome,
                preco
            };

            const novoProduto = await Produto.create(produto);

            res.status(201).json({success:true, message: "Produto criado com sucesso" ,data: novoProduto});

        } catch (err) {
            
            console.log(err);
            res.status(500).json({success:false, message: "Erro interno no servidor"});

        }
    }

    static async buscarProduto(req, res){
        try {
            
            const {id} = req.params;

            const produto = await Produto.findOne({where:{id}});

            res.status(200).json({success: true, message:"Produto encontrado com sucesso",data:produto});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

}