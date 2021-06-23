const validarPrice = (req,resp,next) =>{

    //Vairable logicas
    let price = req.body.price;

    console.log("El precio es: ",typeof price)

    //Validamos que sea numero
    if (typeof price === 'number')
        next()
    //Validamos que sea undefined
    else if (typeof price === 'undefined')
        next()
    //Validamos que sea string
    else if (typeof price === 'string'){
        //validamos que sea string palabra
        if(isNaN(parseInt(price)))
            resp.status(403).json({"Message": "The attribute price must be a number"});
        //validamos que sea string numero
        else
            next();
    //Validamos que manden cualquier cosa rara
    }else{
        resp.status(403).json({"Message": "The attribute price must be a number"});
    }
}

module.exports = validarPrice;