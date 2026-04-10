const { Op } = require("sequelize");
const { OrdemVenda, Pedido, Cliente, Categoria, Estoque, Item } = require("../models/Index");
const registrarLog = require("../utils/log");

module.exports = class ordemVendaController {
  static async buscaOrdemVenda(req, res) {
    try {
      const ordens = await OrdemVenda.findAll({
        raw: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          association: "pedido",
        },
      });

      if (ordens.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Nenhum pedido encontrado" });
      }

      res.status(200).json({
        success: true,
        message: "Ordens de venda encontradas",
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
        return res.status(404).json({
          success: false,
          message: "Ordem de venda não encontrada ou já entregue",
        });
      }

      const dadosPedido = await Pedido.findOne({
        where: { id: dadosOrdemVenda.pedido_id },
        include: [{ model: Item, as: "itens" }],
      });

      if (!dadosPedido) {
        return res.status(404).json({
          success: false,
          message: "Pedido relacionado a Ordem de venda não encontrado",
        });
      };

      const clienteCadastrado = await Cliente.findOne({
        where: { id: dadosPedido.cliente_id },
      });

      if (!clienteCadastrado) {
        return res
          .status(400)
          .json({ success: false, message: "Cliente não foi encontrado" });
      }

      for (const item of dadosPedido.itens) {
        const estoque = await Estoque.findOne({
          where: { produto_id: item.produto_id },
        });

        if (!estoque) {
          return res.status(400).json({
            success: false,
            message: "Estoque não encontrado"
          });
        }

        if (estoque.quantidade_reservada < item.quantidade) {
          return res.status(400).json({
            success: false,
            message: "Estoque inconsistente"
          });
        }

        await estoque.decrement("quantidade_fisica", {
          by: item.quantidade,
        });

        await estoque.decrement("quantidade_reservada", {
          by: item.quantidade,
        });
      }

      const pontosAcumulados = 
        Number(clienteCadastrado.pontos) + Number(dadosPedido.pontos_calculados)
      ;

      const novaCategoria = await Categoria.findOne({
        where: {
          pontos_necessarios: {
            [Op.lte]: pontosAcumulados,
          },
        },
        order: [["pontos_necessarios", "DESC"]],
      });

      const novaCategoriaId = novaCategoria
        ? novaCategoria.id
        : clienteCadastrado.categoria_id;

      const atualizacaoOrdemVenda = await dadosOrdemVenda.update({
        status: "entregue",
      });

      await registrarLog({
        tabela_db: "Ordem_vendas",
        acao: "Finalizada",
        registro_id: atualizacaoOrdemVenda.id,
        detalhe: `Ordem de venda ${atualizacaoOrdemVenda.id} foi finalizada`,
      });

      const clienteAtualizado = await clienteCadastrado.update({
        pontos: pontosAcumulados,
        categoria_id: novaCategoriaId,
      });

      await registrarLog({
        tabela_db: "Cliente",
        acao: "Pontos adicionados",
        registro_id: clienteAtualizado.id,
        detalhe: `Pontos de cliente ${clienteAtualizado.nome} foi atualizada através do pedido ${atualizacaoOrdemVenda.numero_pedido}`,
      });

      res.status(200).json({
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
