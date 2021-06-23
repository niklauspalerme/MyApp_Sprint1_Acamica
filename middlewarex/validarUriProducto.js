let productos = require('../variables/productos');

const validarUriProducto = (req,resp,next)=>{

    let idProduct = parseInt(req.params.idProduct);

    //Si es NaN el IdProduct
    if (isNaN(idProduct))
        resp.status(404).json({"Message": "The product id doesn't exists. Please try a correct one"});
    //Si no es NaN el IdProduct
    else{

        let producto = productos.filter(product => product.id === idProduct)

        //Si el IdProduct no esta en el arreglo
        if (producto.length === 0)
            resp.status(404).json({"Message": "The product id doesn't exists. Please try a correct one"});
        //Si el IdProduct esta en el arreglo
        else
            next();
    }
}

module.exports = validarUriProducto;