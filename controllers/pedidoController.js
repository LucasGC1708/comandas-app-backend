const { Pedido, Cliente, OrdemVenda } = require("../models/Index");
const registrarLog = require("../utils/log");

module.exports = class pedidoController {
  static async criarPedido(req, res) {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Favor informar o cliente do pedido",
          });
      }

      const cliente = await Cliente.findOne({ where: { cpf: cpf }, raw: true });

      if (!cliente) {
        return res
          .status(404)
          .json({ success: false, message: "Cliente não encontrado" });
      }

      const pedidoPendente = await Pedido.findAll({
        where: { cliente_id: cliente.id, status: "pendente" },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (pedidoPendente.length > 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "O cliente em questão tem um pedido pendente em seu nome",
            pendente: pedidoPendente,
          });
      }

      const ultimoPedidoCriado = await Pedido.findOne({
        order: [["createdAt", "DESC"]],
      });

      const numeroPedido = 1;

      if (ultimoPedidoCriado) {
        numeroPedido = numeroPedido + ultimoPedidoCriado.numero_pedido;
      }

      const pedido = {
        cliente_id: cliente.id,
        numero_pedido: numeroPedido,
      };

      const novoPedido = await Pedido.create(pedido);

      await registrarLog({
        tabela_db: "Pedidos",
        acao: "Criar",
        registro_id: novoPedido.id,
        detalhe: `Pedido criado com sucesso ${novoPedido.numero_pedido} para o cliente ${novoPedido.cliente_id}`,
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Pedido criado com sucesso",
          data: novoPedido,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async buscarPedido(req, res) {
    try {
      const id = req.params.id;

      const pedido = await Pedido.findOne({
        where: { id },
        include: [
          {
            association: "itens",
            attributes: ["quantidade", "valorTotal", "id"],
            include: [
              {
                association: "produto",
                attributes: ["id", "nome", "preco"],
              },
            ],
          },
        ],
      });

      if (!pedido) {
        return res
          .status(404)
          .json({ success: false, message: "Pedido não foi encontrado" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Pedido encontrado com sucesso",
          data: pedido,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async finalizarPedido(req, res) {
    try {
      const { id } = req.params;

      const pedidoCadastrado = await Pedido.findOne({ where: { id } });

      if (!pedidoCadastrado) {
        return res
          .status(404)
          .json({ success: false, message: "Pedido não foi encontrado" });
      }

      if (pedidoCadastrado.status === "finalizado") {
        return res
          .status(400)
          .json({ success: false, message: "Pedido já foi finalizado" });
      }

      const itens = await pedidoCadastrado.getItens();

      if (itens.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Pedido não possui itens" });
      }

      const calculoPontos = pedidoCadastrado.valorPedido/10;

      const finalizacaoPedido = await pedidoCadastrado.update({
        status: "finalizado",
        pontos_calculados:calculoPontos
      });

      await registrarLog({
        tabela_db: "Pedidos",
        acao: "Finalizado",
        registro_id: finalizacaoPedido.id,
        detalhe: `Pedido ${finalizacaoPedido.id} foi finalizado`,
      });

      const novaOrdemVenda = await OrdemVenda.create({
        pedido_id: pedidoCadastrado.id,
      });

      await registrarLog({
        tabela_db: "Ordem_Vendas",
        acao: "Criada",
        registro_id: novaOrdemVenda.id,
        detalhe: `Ordem ${novaOrdemVenda.id} foi criada através do pedido ${novaOrdemVenda.pedido_id}`,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Pedido finalizado com sucesso",
          data: finalizacaoPedido,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async apagarPedido(req, res) {
    try {
      const { id } = req.body;

      const pedidoCadastrado = await Pedido.findOne({ where: { id } });

      if (!pedidoCadastrado) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Pedido não foi encontrado para a exclusão",
          });
      }

      const ordemDePedido = await OrdemVenda.findOne({
        where: { pedido_id: pedidoCadastrado.id, status: "entregue" },
        raw: true,
      });

      if (ordemDePedido) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Este pedido não pode mais ser excluído pois sua ordem de venda já foi finalizada",
          });
      }

      const exclusaoPedido = await pedidoCadastrado.destroy();

      await registrarLog({
        tabela_db: "Pedidos",
        acao: "Excluir",
        registro_id: exclusaoPedido.id,
        detalhe: `Exclusão de pedido ${exclusaoPedido.id} realizada`,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Pedido excluído com sucesso",
          data: exclusaoPedido,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }
};
