let pedidos = require('../variables/pedidos');

const validarPedidosExistentes = (req,resp,next)=>{

    let id = parseInt(req.params.idPedido);
    let pedido = pedidos.filter(pedidox => pedidox.id === id);

    if (pedido.length === 0)
        resp.status(404).json({"Message": "The Order doesn't exist, please try with another one"});
    else
        next();
}

module.exports= validarPedidosExistentes;