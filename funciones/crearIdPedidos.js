const pedidos = require("../variables/pedidos");

const crearIdPedidos = ()=>{

    if (pedidos.length === 0){
        
       return 1;

    } else {

        let posicionUltimoPedido = pedidos.length -1;
        let ultimoPedidoId = pedidos[posicionUltimoPedido].id;
        let nuevoId = ultimoPedidoId + 1; 
        return nuevoId;

    }    

}

module.exports = crearIdPedidos;