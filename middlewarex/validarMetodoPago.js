let paymentMethods = require('../variables/metodosDePago');

const validarMetodoPago = (req,resp,next) =>{

    let paymentMethod = req.body.paymentMethod;

    const found = paymentMethods.find( paymentMethodx => paymentMethodx === paymentMethod)

    if(found !== undefined)
        next()
    else
        resp.status(403).json({"Message": "The paymentMethod is invalid, please try with another one"})

}


module.exports= validarMetodoPago;