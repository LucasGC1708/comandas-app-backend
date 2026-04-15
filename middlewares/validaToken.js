const TOKEN_FIXO =  process.env.TOKENAPI;

function validaToken(req, res, next){
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({success:false, message:"Token não informado ou mal formatado"});
    }

    const token = authorization.replace("Bearer ","");

    if(token !== TOKEN_FIXO){
        return res
            .status(403)
            .json({success:false, message:"Token inválido"});
    }

    next();
}

module.exports = validaToken;