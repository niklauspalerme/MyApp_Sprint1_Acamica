const productos = require("../variables/productos");


//Funcion #1 - Para eliminar la quantity de los productos creados en el menu 
const mostrarProductos = () =>{

    let productos2 = productos
    productos2.map(  producto =>{
        return delete producto.quantity
    })

    return productos2
}


module.exports= mostrarProductos;