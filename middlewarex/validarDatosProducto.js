const validarDatosProducto = (req,resp,next)=>{

    let name = req.body.name || "";
    let description = req.body.description || "";
    let picture = req.body.picture || ""
    let price = req.body.price || ""

    if (name === "")
        resp.status(400).json({"Message": "The atribute name cannot be empty"})
    else if ( description === "")
        resp.status(400).json({"Message": "The atribute description cannot be empty"})
    else if (picture === "")
        resp.status(400).json({"Message": "The atribute picture cannot be empty"})
    else if (price === "")
        resp.status(400).json({"Message": "The atribute price cannot be empty"})
    else if (isNaN(parseInt(price)))
        resp.status(403).json({"Message": "The atribute price must be a number"})
    else
        next()
}

module.exports= validarDatosProducto;