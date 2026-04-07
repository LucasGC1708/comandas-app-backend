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
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }
};
