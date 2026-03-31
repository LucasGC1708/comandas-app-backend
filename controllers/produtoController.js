const Produto = require('../models/Produto');
const registrarLog = require('../utils/log');

module.exports = class produtoController{

    static async criarProduto(req, res){
        try {
            
            const {nome, preco} = req.body;

            if(!nome || !preco){
                return res.status(400).json({success:false, message: "Favor preenhcer todos os campos"});
            }

            if(isNaN(preco)){
                return res.status(400).json({success:false, message: "Favor preenhcer preco com número"});
            }

            const ultimoProdutoCriado = await Produto.findOne({
                order: [['createdAt', 'DESC']],
            });

            let numeroSku = 100000;

            if(ultimoProdutoCriado){
                numeroSku = ultimoProdutoCriado.sku + 1;
            }

            const produto = {
                nome,
                preco,
                sku:numeroSku
            };

            const novoProduto = await Produto.create(produto);

            await registrarLog({
                tabela_db:"Produtos",
                acao:"Criar",
                registro_id:novoProduto.id,
                detalhe:`Novo produto ${novoProduto.nome} foi criado com sku ${numeroSku}`
            });

            res.status(201).json({success:true, message: "Produto criado com sucesso" ,data: novoProduto});

        } catch (err) {
            
            console.log(err);
            res.status(500).json({success:false, message: "Erro interno no servidor"});

        }
    }

    static async criarProdutoEmMassa(req,res){
        try {
            
            const {listaProdutos} = req.body;

            if(listaProdutos.length == 0){
                res.status(400).json({success:false, message:"Favor adicionar os produtos a lista"});
            };

            const ultimoProdutoCriado = await Produto.findOne({
                order: [['sku', 'DESC']],
            });

            let numeroSku = 100000;

            if(ultimoProdutoCriado){
                numeroSku = ultimoProdutoCriado.sku + 1;
            };

            const produtosComSku = listaProdutos.map((produto, index) => {
                return {
                    ...produto,
                    sku: numeroSku + index
                };
            });

            const produtosCriados = await Produto.bulkCreate(produtosComSku);

            await Promise.all(
                produtosCriados.map(produto => 
                    registrarLog({
                        tabela_db: "Produtos",
                        acao: "Criar",
                        registro_id: produto.id,
                        detalhe: `Novo produto ${produto.nome} foi criado com sku ${produto.sku}`
                    })
                )
            );

            res.status(200).json({success:true, message:"Adição em massa realizada", data:produtosCriados});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no server"});
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

    static async listarProdutos(req, res){
        try {

            const produto = await Produto.findAll({where:{ativo:true}});

            res.status(200).json({success: true, message:"Produto encontrado com sucesso",data:produto});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

    static async editarProduto(req, res){

        try {
            
            const {id, preco} = req.body;

            if (!id || !preco) {
                 return res.status(400).json({success:false, message: "Favor preenhcer os campos"});
            }

            if (isNaN(preco)) {
                return res.status(400).json({success:false, message: "Favor preenhcer preco com número"});
            }

            const produtoCadastrado = await Produto.findOne({where:{id}});

            const valorAnterior = produtoCadastrado.preco;

            if(!produtoCadastrado){
                 return res.status(404).json({success:false, message: "Produto não foi encontrado"});
            }

            const edicaoProduto = await produtoCadastrado.update({preco});

            await registrarLog({
                tabela_db:"Produtos",
                acao:"Edição",
                registro_id:edicaoProduto.id,
                detalhe:`Produto ${edicaoProduto.nome} foi editado novo valor ${edicaoProduto.preco} e valor anterior era ${valorAnterior}`
            });

            res.status(200).json({success: false, message:"Produto editado com sucesso", data:edicaoProduto});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }

    }

    static async desativarProduto(req, res){
        try {
            
            const {id} = req.body;

            const produtoCadastrado = await Produto.findOne({where:{id, ativo:true}});

            if(!produtoCadastrado){
                return res.status(400).json({success:false, message:"Produto não encontrado ou já desativado"});
            }

            const atualizacaoProduto = await produtoCadastrado.update({ativo:false});

            await registrarLog({
                tabela_db:"Produtos",
                acao:"Excluir",
                registro_id:atualizacaoProduto.id,
                detalhe:`Produto ${atualizacaoProduto.nome} foi desativado`
            });

            res.status(200).json({success:true, message:"Produto desativado com sucesso", data: atualizacaoProduto});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

}