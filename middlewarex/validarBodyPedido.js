const existenciaIDProductosBoolean = require('../funciones/existenciaIDProductosBoolean');

const validarBodyPedido = (req,resp,next) =>{
    
    let paymentMethod = req.body.paymentMethod || "";
    let address = req.body.address || "";
    let products = req.body.products || ""

    //Validamos que no esten vacio los attributos del body
    if (paymentMethod === "")
        resp.status(400).json({"Message": "The attribute paymentMethod cannot be empty"})
    else if (address === "")
        resp.status(400).json({"Message": "The attribute address cannot be empty"})
    else if (products === "" || products.length === 0)
        resp.status(400).json({"Message": "The attribute products cannot be empty"})

    //Validamos la existencia de los productos
    let productsCheckingAvailability = products.map( product => {
        let id = parseInt(product.idProduct);
        let resultado = existenciaIDProductosBoolean(id)
        return resultado
    })

    let availability = productsCheckingAvailability.every(available =>  available === true)

    if(availability)
        next()
    else
        resp.status(404).json({"Message": "The attribute products contain some idProduct doesn't exist on the menu"});

}

module.exports = validarBodyPedido;