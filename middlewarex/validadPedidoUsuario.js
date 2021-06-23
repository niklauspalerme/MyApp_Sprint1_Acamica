let pedidos = require('../variables/pedidos');
let usuarios = require('../variables/usuarios');

const validarPedidoUsuario = (req,resp,next)=>{

    let usertoken = parseInt(req.headers.usertoken)
    let id = parseInt(req.params.idPedido);

    let pedido = pedidos.find(pedidox => pedidox.id === id)

    if(pedido.user === usuarios[usertoken].user)
        next()
    else
        resp.status(409).json({"Message": `The order is not from this User. Please try with another order`})

}

module.exports= validarPedidoUsuario;