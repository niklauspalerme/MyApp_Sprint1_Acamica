let usuarios = require('../variables/usuarios');

const validarLogin = (req,resp,next)=>{
    
    let user = req.body.user || "";
    let password = req.body.password || "";
    let email = req.body.email || ""; 

    let indexUsuarioEncontrado = usuarios.findIndex(
        (usuario)=> (usuario.user === user || usuario.email === email) && usuario.password == password)

    if(indexUsuarioEncontrado == -1)
        resp.status(403).json({"Message": "The user/email or password incorrect"})
    else
        next()
}

module.exports = validarLogin;