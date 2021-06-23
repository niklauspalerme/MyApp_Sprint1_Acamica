const productos = require("../variables/productos")

const obtenerPrecioProducto = (idxs) => {

    let resultadoEncontrado = productos.findIndex(product => product.id === idxs) 

    //console.log(resultadoEncontrado)

    return productos[resultadoEncontrado].price;
}

const calcularPrecioTotalPedido = (products) => {

    let totalPrice = 0;

    //Obtenemos los precios de cada array de objeto
    //Lo colocamos en 1 nuevo
    let prices = products.map( product => {
        //console.log(product)
        let id = parseInt(product.idProduct);
        let resultado = obtenerPrecioProducto(id)
        return resultado
    })

    //console.log(prices)

    //Itereamos nuestro array de productos y lo sumamos
    //En base de nuestro array de precios
    products.forEach( (product,index) => {
        totalPrice += product.quantity * prices[index]
    });

    //console.log(totalPrice)
    return totalPrice

}

module.exports= calcularPrecioTotalPedido;