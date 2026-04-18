const { Cliente, Categoria } = require("../models/Index");
const registrarLog = require("../utils/log");
const createToken = require("../utils/createToken");

module.exports = class clienteController {
  static async buscaClientePorCPF(req, res) {
    try {
      const dadosCliente = await Cliente.findOne({
        where: { cpf: req.params.cpf, ativo: true },
        include:[{
          association:"categoria",
          attributes:["id", "nome", "desconto", "pontos_necessarios"]
        }]
      });

      if (!dadosCliente) {
        return res
          .status(404)
          .json({ success: false, message: "Cliente não foi encontrado" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Cliente encontrado",
          data: dadosCliente,
        });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Erro interno no servidor" });
    }
  }

  static async criarCliente(req, res) {
    try {
      const { nome, email, cpf } = req.body;

      if (!nome || !email || !cpf) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Favor preencher todos os campos",
            nome,
            cpf,
            email,
          });
      }

      if (cpf.length != 11) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Necessário que cpf tenha 11 caracteres",
            nome,
            cpf,
            email,
          });
      }

      const clienteCadastrado = await Cliente.findOne({ where: { cpf } });

      if (clienteCadastrado) {
        return res
          .status(409)
          .json({
            success: false,
            message: "Este cpf já está cadastrado",
            nome,
            cpf,
            email,
          });
      }

      const categoriaPadrao = await Categoria.findOne({order:[["pontos_necessarios", "ASC"]]});

      if(!categoriaPadrao){
        return res.status(400).json({success:false, message:"Nenhuma categoria cadastrada no sistema"});
      }

      const cliente = {
        nome,
        email,
        cpf,
        categoria_id:categoriaPadrao.id
      };

      const novoCliente = await Cliente.create(cliente);

      await registrarLog({
        tabela_db: "Clientes",
        acao: "Criar",
        registro_id: novoCliente.id,
        detalhe: `Novo cliente ${novoCliente.nome} adicionado`,
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Cliente criado com sucesso",
          data: novoCliente,
        });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Erro interno no servidor" });
    }
  }

  static async desativaCliente(req, res) {
    try {
      const { id } = req.body;

      const pedidoCadastrado = await Cliente.findOne({ where: { id } });

      if (!pedidoCadastrado) {
        return res
          .status(404)
          .json({ success: false, message: "Cliente não foi encontrado" });
      }

      const desativacaoCliente = await pedidoCadastrado.update({
        ativo: false,
      });

      await registrarLog({
        tabela_db: "Clientes",
        acao: "Desativar",
        registro_id: desativacaoCliente.id,
        detalhe: `Cliente ${desativacaoCliente.nome} foi desativado`,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Cliente foi desativado",
          data: desativacaoCliente,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  }

  static async editarCliente(req, res){
    try {
      
      const {clienteId, clienteCPF, clienteEmail, clienteNome} = req.body;

      if(!clienteId){
        return res
          .status(400)
          .json({success:false, message:"Favor informar o cliente que deseja editar"});
      }

      const cliente = await Cliente.findOne({
        where:{id:clienteId},
      });

      if(!cliente){
        return res
          .status(400)
          .json({success:false, message:"Cliente não foi encontrado"});
      }

      const clienteAtualiza = {
        cpf: clienteCPF ? clienteCPF : cliente.cpf,
        email: clienteEmail ? clienteEmail : cliente.email,
        nome: clienteNome ? clienteNome : cliente.nome
      };

      await cliente.update(clienteAtualiza);

      await registrarLog({
        tabela_db: "Clientes",
        acao: "Editado",
        registro_id: cliente.id,
        detalhe: `O cliente ${cliente.nome} foi editado`,
      });

      res.status(200).json({success:true, message:"Cliente atualizado com sucesso", data:cliente});


    } catch (err) {
      console.log(err);
      res.status(500).json({success:false, message:"Erro no Servidor"});
    }
  }

  static async login(req, res){
    try {
      
      const { cpf } = req.body;

      if (!cpf) {
        return res.status(400).json({
          success: false,
          message: "Informe o CPF",
        });
      }

      const cliente = await Cliente.findOne({ where: { cpf } });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente não encontrado",
        });
      }

      const token = createToken(cliente);

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        token,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({success:false, message:"Erro no servidor"});
    }
  }
};
