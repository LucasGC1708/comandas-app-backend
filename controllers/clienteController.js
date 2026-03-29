const Cliente = require('../models/Cliente');
const registrarLog = require('../utils/log');

module.exports = class clienteController{

    static async buscaClientePorCPF(req, res){
        try {
            
            const dadosCliente = await Cliente.findOne({where:{cpf: req.params.cpf, ativo:true}});

            if(!dadosCliente){
                return res.status(404).json({success: false, message: "Cliente não foi encontrado"});
            }

            res.status(200).json({success:true, message:"Cliente encontrado" , data:dadosCliente});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro interno no servidor"})

        }
    }

    static async criarCliente(req, res){

        try {

            const {nome, email, cpf} = req.body;

            if(!nome || !email || !cpf){
                return res.status(400).json({success:false, message: "Favor preencher todos os campos", nome, cpf, email});
            }

            if(cpf.length != 11){
                return res.status(400).json({success:false, message: "Necessário que cpf tenha 11 caracteres", nome, cpf, email});
            }

            const clienteCadastrado = await Cliente.findOne({where:{cpf}});

            if(clienteCadastrado){
                return res.status(409).json({success:false, message: "Este cpf já está cadastrado", nome, cpf, email});
            }

            const cliente = {
                nome,
                email,
                cpf
            }

            const novoCliente = await Cliente.create(cliente);

            await registrarLog({
                tabela_db:"Clientes",
                acao:"Criar",
                registro_id:novoCliente.id,
                detalhe:`Novo cliente ${novoCliente.nome} adicionado`
            });

            res.status(201).json({success:true, message: "Cliente criado com sucesso", data: novoCliente});

        } catch (err) {
            
            console.log(err);
            res.status(500).json({success:false, message:"Erro interno no servidor"})

        }

    }

    static async desativaCliente(req,res){
        try {
            
            const {id} = req.body;

            const pedidoCadastrado = await Cliente.findOne({where: {id}});

            if(!pedidoCadastrado){
                return res.status(404).json({success:false, message:"Cliente não foi encontrado"});
            }

            const desativacaoCliente = await pedidoCadastrado.update({ativo:false});

            await registrarLog({
                tabela_db:"Clientes",
                acao:"Desativar",
                registro_id:desativacaoCliente.id,
                detalhe:`Cliente ${desativacaoCliente.nome} foi desativado`
            });

            res.status(200).json({success: true, message:"Cliente foi desativado", data:desativacaoCliente});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:false, message:"Erro no servidor"});
        }
    }

}