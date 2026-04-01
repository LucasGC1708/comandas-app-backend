const {Categoria} = require('../models/Index');
const registrarLog = require('../utils/log');

module.exports = class categoriaController{

    static async listarCategorias(req, res){
        try {
            
            const categoriasEncontradas = await Categoria.findAll();

            if(categoriasEncontradas.length <= 0){
                return res.status(404).json({success: false, message:"Não foi encontrado nenhuma categoria registrada"});
            }

            res.status(200).json({success: true, message:"Categorias encontrados com sucesso", data:categoriasEncontradas});

        } catch (err) {
            console.log(err);
            res.status(500).message({success: false, message:"Erro no servidor"});
        }
    }

    //AÇÕES DE CRIAÇÃO
    static async criarCategoria(req, res){
        try {
            
            const {nome, desconto, pontos} = req.body;

            if (!nome || !desconto || pontos == null) {
                return res.status(400).json({success:false, message:"Favor preencher todos os campos"});
            }

            const categoria = {
                nome,
                desconto,
                pontos_necessarios:pontos,
            };

            const novaCategoria = await Categoria.create(categoria);

            registrarLog({
                tabela_db:"categoria",
                acao:"Criar",
                registro_id:novaCategoria.id,
                detalhe:`Nova categoria ${novaCategoria.nome} foi adicionada com sucesso`,
            });

            res.status(201).json({success:true, message:"Nova categoria adicionada", data:novaCategoria});

        } catch (err) {
            console.log(err);
            res.status(500).json({success:true, message:"Erro no servidor"})
        }
    }

    static async criarCategoriasEmMassa(req,res){
        try {
            
            const {listaCategorias} = req.body;

            if(!listaCategorias.length){
                return res.status(400).json({success:false, message: "É necessário adicionar uma categoria para realizar está ação"});
            }

            const validacaoCamposLista = await listaCategorias.map((categoria) =>{
                if (!categoria.nome || !categoria.desconto || categoria.pontos == null) {
                    return{
                        ...categoria,
                        error: true,
                        message:"Favor Preencher todos os campos"
                    };
                }
                return{
                    ...categoria,
                    error:false,
                    message:"registro de acordo com as regras"
                };
            });

            


        } catch (err) {
            
        }
    }
}