let usuarios = require('../variables/usuarios');

const validarAutentificacionAdmins = (req,resp,next) => {
    
    let usertoken = parseInt(req.headers.usertoken)

    if (isNaN(usertoken))
        resp.status(401).json({"Message": "Access to requested resource is denied. The Request Must has usertoken as headers"})
    else {
            let usuario = usuarios[usertoken] || []
            if (usuario.length === 0){
                resp.status(401).json({"Message": "Access to requested resource is denied. The usertoken is invalid"})
            }else{

                if (usuario.admins === false)
                    resp.status(401).json({"Message": "Access to requested resource is denied. The usertoken is invalid"})
                else
                    next();
                    
            }
        }
}

module.exports= validarAutentificacionAdmins;