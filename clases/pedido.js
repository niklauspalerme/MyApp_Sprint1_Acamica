class Pedido {

    constructor(state, dataTime, id ,totalPrice, user, paymentMethod, address, products){
        this.state = state;
        this.dataTime = dataTime;
        this.id = id;
        this.totalPrice = totalPrice;
        this.user = user;
        this.paymentMethod = paymentMethod
        this.address= address;
        this.products= products
    }

}

module.exports = Pedido;