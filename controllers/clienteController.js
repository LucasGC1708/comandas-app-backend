const Cliente = require('../models/Cliente');

module.exports = class clienteController{

    static async buscaClientePorCPF(req, res){
        try {
            
            const dadosCliente = await Cliente.findOne({where:{cpf: req.params.cpf}, raw:true});

            if(!dadosCliente){
                return res.status(404).json({success: false, message: "Cliente não foi encontrado"});
            }

            res.status(200).json({success:true, data:dadosCliente});

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
                return res.status(400).json({success:false, message: "Necessário que cpf tenha apenas 11 caracteres", nome, cpf, email});
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

            await Cliente.create(cliente);

            res.status(201).json({success:true, message: "Cliente criado com sucesso", data: cliente});

        } catch (err) {
            
            console.log(err);
            res.status(500).json({success:false, message:"Erro interno no servidor"})

        }

    }

}