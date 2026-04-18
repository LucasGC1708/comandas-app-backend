const jwt = require('jsonwebtoken');

const createToken = (client)=>{
    const token = jwt.sign(
        {
            id:client.id,
            cpf:client.cpf
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    );

    return token;
}

module.exports = createToken