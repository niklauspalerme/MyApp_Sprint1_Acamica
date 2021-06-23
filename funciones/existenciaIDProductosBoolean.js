let productos = require("../variables/productos")

function existenciaIDProductosBoolean (idxs) {

    let resultadoEncontrado = productos.findIndex(product => product.id === idxs) 

    if (resultadoEncontrado === -1)
        return false
    else
        return true
}

module.exports = existenciaIDProductosBoolean;
