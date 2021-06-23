let usuarios = require('../variables/usuarios');

const validarAutentificacionUsuario = (req,resp,next)=>{

    let usertoken = parseInt(req.headers.usertoken)
    if (isNaN(usertoken))
        resp.status(401).json({"Message": "Access to requested resource is denied. The Request Must has usertoken as headers"})
    else {
        let usuario = usuarios[usertoken];
        if (usuario === undefined)
            resp.status(401).json({"Message": "Access to requested resource is denied. The usertoken is invalid"})
        else
            next()
    }
}

module.exports= validarAutentificacionUsuario;