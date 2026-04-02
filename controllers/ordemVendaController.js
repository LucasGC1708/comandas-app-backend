const { OrdemVenda, Pedido } = require("../models/Index");
const registrarLog = require("../utils/log");

module.exports = class ordemVendaController {
  static async buscaOrdemVenda(req, res) {
    try {
      const ordens = await OrdemVenda.findAll({
        raw: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (ordens.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Nenhum pedido encontrado" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Ordens de venda encontrados",
          data: ordens,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async finalizaOrdemVenda(req, res) {
    try {
      const { id } = req.body;

      const dadosOrdemVenda = await OrdemVenda.findOne({
        where: { id, status: "pendente" },
      });

      if (!dadosOrdemVenda) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Ordem de venda não encontrada ou já entregue",
          });
      }

      const dadosPedido = await Pedido.findOne({
        where: { id: dadosOrdemVenda.pedido_id },
      });

      if (!dadosPedido) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Pedido relacionado a Ordem de venda não encontrado",
          });
      }

      const atualizacaoOrdemVenda = await dadosOrdemVenda.update({
        status: "entregue",
      });

      await registrarLog({
        tabela_db: "Ordem_vendas",
        acao: "Finalizada",
        registro_id: atualizacaoOrdemVenda.id,
        detalhe: `Ordem de venda ${atualizacaoOrdemVenda.id} foi finalizada`,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Ordem de venda finalizada",
          data: atualizacaoOrdemVenda,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "erro no servidor" });
    }
  }
};
