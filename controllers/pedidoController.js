const { Pedido, Cliente, OrdemVenda } = require("../models/Index");
const registrarLog = require("../utils/log");

module.exports = class pedidoController {
  static async criarPedido(req, res) {
    try {
      const clienteId = req.user.id; // 🔥 vem do token

    const pedidoPendente = await Pedido.findOne({
      where: { cliente_id: clienteId, status: "pendente" }
    });

    if (pedidoPendente) {
      return res.status(400).json({
        success: false,
        message: "Você já possui um pedido pendente",
        pendente: pedidoPendente,
      });
    }

    const novoPedido = await Pedido.create({
      cliente_id: clienteId,
    });

    await registrarLog({
      tabela_db: "Pedidos",
      acao: "Criar",
      registro_id: novoPedido.id,
      detalhe: `Pedido criado para o cliente ${clienteId}`,
    });

    return res.status(201).json({
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

      const ultimoPedidoCriado = await Pedido.findOne({
        where: {
          numero_pedido: { [Op.ne]: null }
        },
        order: [["numero_pedido", "DESC"]],
      });

      let numeroPedido = ultimoPedidoCriado ? ultimoPedidoCriado.numero_pedido + 1 : 100;

      const calculoPontos = Number((pedidoCadastrado.valorPedido/10).toFixed(2));

      const novaOrdemVenda = await OrdemVenda.create({
        pedido_id: pedidoCadastrado.id,
      });

      await registrarLog({
        tabela_db: "Ordem_Vendas",
        acao: "Criada",
        registro_id: novaOrdemVenda.id,
        detalhe: `Ordem ${novaOrdemVenda.id} foi criada através do pedido ${novaOrdemVenda.pedido_id}`,
      });

      const finalizacaoPedido = await pedidoCadastrado.update({
        status: "finalizado",
        pontos_calculados:calculoPontos,
        numero_pedido:numeroPedido
      });

      await registrarLog({
        tabela_db: "Pedidos",
        acao: "Finalizado",
        registro_id: finalizacaoPedido.id,
        detalhe: `Pedido ${finalizacaoPedido.numero_pedido} foi finalizado`,
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

  static async retrocederPedido(req, res){
    try {
      
      const {id} = req.body;

      if(!id){
        return res
          .status(400)
          .json({success:false, message:"Favor informar o identificador único do pedido"});
      }

      const pedido = await Pedido.findOne({
        where:{id}
      });

      if(!pedido){
        return res
          .status(404)
          .json({success:false, message:"Pedido não foi encontrado para retroceder"});
      };

      if(pedido.status === "pendente"){
        return res
          .status(400)
          .json({success:false, message:"Este pedido não avançou para poder ser retrocedido"});
      }

      const ordemVenda = await OrdemVenda.findOne({
        where:{pedido_id:pedido.id}
      });

      if(!ordemVenda){
        return res
          .status(404)
          .json({success:false, message:"Não foi encontrado a ordem de venda deste pedido"});
      }

      if(ordemVenda.status === "entregue"){
        return res
          .status(400)
          .json({success:false, message:"Este pedido já teve sua ordem de venda entregue por este motivo não é possível mais retroceder"});
      }

      await ordemVenda.destroy();

      await registrarLog({
        tabela_db: "ordem_venda",
        acao:"Excluir",
        registro_id:ordemVenda.id,
        detalhe:`A ordem de venda foi retirada pelo processo de retroceder do pedido ${pedido.numero_pedido}`
      });

      await pedido.update({
        status:"pendente",
        pontos_calculados:0.00,
        numero_pedido:null
      });

      await registrarLog({
        tabela_db: "pedidos",
        acao:"Retroceder",
        registro_id:pedido.id,
        detalhe:`O pedido de numeração ${pedido.numero_pedido} foi retrocedido`
      });

      res
        .status(200)
        .json({success:true, message:"Sucesso no processo de retroceder o pedido", data:pedido});

    } catch (err) {
      console.log(err);
      res.status(500).json({success:false,message:"Erro no servidor"});
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
