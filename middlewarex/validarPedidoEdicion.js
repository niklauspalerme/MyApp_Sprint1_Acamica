let pedidos = require('../variables/pedidos');
const calcularPrecioTotalPedido = require('../funciones/calcularPrecioTotalPedido');
const existenciaIDProductosBoolean = require('../funciones/existenciaIDProductosBoolean');

const validarPedidoEdicion = (req,resp,next) =>{

    let id= parseInt(req.params.idPedido);
    let indexPedido = pedidos.findIndex(pedido => pedido.id === id);
    let products = req.body.products || []
    
    if (pedidos[indexPedido].state !== "Pendiente")
        resp.status(409).json({"Message": "The request cannot be processed. The state of the order is already processed"})
    else{
        //Si es array
        if ( Array.isArray(products) === true){

            //Si es array vavio
            if(products.length === 0)
                resp.status(403).json({"Message": `The attribute products is invalid, please insert another one`})
            else{
                    
                
                //Validamos la existencia de los productos
                let productsCheckingAvailability = products.map( product => {
                    let id = parseInt(product.idProduct);
                    let resultado = existenciaIDProductosBoolean(id)
                    return resultado
                })

                let availability = productsCheckingAvailability.every(available =>  available === true)

                //Validamos la existencia de los productos
                if(availability){

                    //Validamos que el price no sea empty/0
                    let totalPrice = calcularPrecioTotalPedido(products);

                    //Si el preciototal es igual a 0 -> quantity = 0
                    if(totalPrice === 0 || isNaN (totalPrice) )
                        resp.status(400).json({"Message": `The Products quantity of the order cannot be empty or 0`})
                    else
                        next()
                }else
                    resp.status(404).json({"Message": "The attribute products contain some idProduct doesn't exist on the menu"});
                }
        }else
        resp.status(403).json({"Message": `The attribute products is invalid, please insert another one`})
    }
    
}

module.exports= validarPedidoEdicion;