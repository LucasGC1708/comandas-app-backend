const { Estoque, Produto } = require("../models/Index");
const registrarLog = require("../utils/log");

module.exports = class estoqueController {
  static async criarEstoque(req, res) {
    try {
      const { produtoId, quantidade } = req.body;

      const buscaProduto = await Produto.findOne({
        where: { id: produtoId },
      });

      if (!buscaProduto) {
        return res
          .status(404)
          .json({ success: false, message: "Produto não encontrado" });
      }

      const buscaEstoqueDuplicado = await Estoque.findOne({
        where: { produto_id: produtoId },
      });

      if (buscaEstoqueDuplicado) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Este produto já possui este cadastrado para está empresa",
          });
      }

      const novoEstoque = await Estoque.create({
        produto_id: produtoId,
        quantidade_fisica: quantidade,
      });

      await registrarLog({
        tabela_db: "estoque",
        acao: "Criar",
        registro_id: novoEstoque.id,
        detalhe: `Novo estoque para o produto ${buscaProduto.nome} criado com sucesso`,
      });

      res.status(201).json({success:true, message:"Estoque criado com sucesso", data:novoEstoque});

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async buscarTodosEstoques(req,res){

    try {
      
      const buscaEstoques = await Estoque.findAll();

      if(buscaEstoques.length == 0){
        return res
          .status(404)
          .json({success:false, message: "Nenhum registro de estoque encontrado"});
      };

      res.status(200).json({success:true, message:"Estoques encontrados", data:buscaEstoques})

    } catch (err) {
      console.log(err);
      res.status(500).json({success:false, message:"Erro no servidor"})
    }

  }

  static async buscarEstoquePorProduto(req, res){
    try {
      
      const {produtoId} = req.params;

      if(!produtoId){
        return res
          .status(404)
          .json({success:false, message:"Favor informar o produto que deseja buscar estoque"});
      }

      const buscarEstoque = await Estoque.findOne({
        where:{produto_id:produtoId},
      });

      if(!buscarEstoque){
        return res
          .status(400)
          .json({success:false, message:"Nenhum estoque encontrado para o produto informado"});
      }

      res.status(200).json({success:true, message:"Estoque foi encontrado", data:buscarEstoque});

    } catch (err) {
      console.log(err);
      res.status(500).json({success:false, message:"Erro no servidor"});
    }
  }

  static async adicionarQuantidade(req,res){
    try {
      
      const {produtoId, quantidade} = req.body;

      if(!produtoId){
        return res
          .status(400)
          .json({success:false, message:"Favor informar o produto que deseja adicionar mais quantidade"});
      }

      if(isNaN(quantidade)) {
        return res
          .status(400)
          .json({success:false, message:"Favor adicionar um valor valido"});
      };

      const buscaProduto = await Produto.findOne({
        where:{id:produtoId}
      });

      if(!buscaProduto){
        return res
          .status(400)
          .json({success:false, message:"Nenhum produto encontrado"});
      };

      const buscaEstoqueProduto = await Estoque.findOne({
        where:{produto_id:buscaProduto.id}
      });

      if(!buscaEstoqueProduto){
        return res
          .status(400)
          .json({success:false, message:"Este produto não possui estoque vinculado"});
      };

      const valorAntigo = buscaEstoqueProduto.quantidade_fisica

      const novaQuantidade = Number(valorAntigo) + Number(quantidade);

      await buscaEstoqueProduto.update({
        quantidade_fisica: novaQuantidade,
      });

      await registrarLog({
        tabela_db: "estoque",
        acao: "Adicionar",
        registro_id: buscaEstoqueProduto.id,
        detalhe: `Novo valor adicionado ao estoque do ${buscaProduto.nome} sua quantidade antiga era de ${valorAntigo} e a nova é de ${novaQuantidade}`,
      });

      res.status(200).json({success:true, message:"Nova quantidade adicionada ao estoque do produto", data: buscaEstoqueProduto});

    } catch (err) {
      console.log(err);
      res.status(500).json({success:false, message:"Erro no servidor"})
    }
  }
};
