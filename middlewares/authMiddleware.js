const jwt = require("jsonwebtoken");
const Cliente = require("../models/Cliente");

const authMiddleware = async (req, res, next) => {
  try {
    // 🔎 pega o header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
    }

    // formato esperado: Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        success: false,
        message: "Token mal formatado",
      });
    }

    const [scheme, token] = parts;

    // 🔐 valida o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cliente = await Cliente.findOne({
        where:{id:decoded.id}
    });

    if (!cliente) {
        return res
            .status(401)
            .json({success:false, message:"Cliente não encontrado ou desativado"});
    }

    req.user = cliente;

    return next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado",
    });
  }
};

module.exports = authMiddleware;