const productos = require("../variables/productos");

const encontrarProducto=(id) =>{

    console.log(id)
    let productoEncontrado = productos.find( product => product.id === id)

    return productoEncontrado

}

const mostrarProductosPedido = (products) =>{

    let productsInfo = products.map(product=>{

        //console.log("Cantidad del producto: ",product.quantity)
        //console.log("id del producto: ",product.idProduct)
        let idProduct = product.idProduct;
        let productoEncontrado = encontrarProducto(idProduct);
        productoEncontrado.quantity = product.quantity;

        return productoEncontrado

    })

    //Array con la info de los productos del pedido
    //console.log ("Array de los productos del pedido:",productsInfo)
    return productsInfo;

}

module.exports = mostrarProductosPedido;