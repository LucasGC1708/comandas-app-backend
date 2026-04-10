function formataPreco(valor){
    return valor.toFixed(2);
}

function numeroInvalido(valor){
    return isNaN(valor) || Number(valor) <= 0;
}

module.exports = {formataPreco, numeroInvalido};