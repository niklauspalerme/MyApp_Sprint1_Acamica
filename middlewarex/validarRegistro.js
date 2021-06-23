let usuarios = require('../variables/usuarios');

const validarRegistro = (req,resp,next) =>{

    let user = req.body.user || "";
    let name = req.body.name || "";
    let email = req.body.email || "";
    let mobile = req.body.mobile || "";
    let address = req.body.address || "";
    let password = req.body.password || "";

    let foundEmail = usuarios.filter(usuario => usuario.email === email);
    let foundUser = usuarios.filter(usuario => usuario.user === user);

    //Validamos los datos que esten llenos y no repetidos
    if(user === "")
        resp.status(400).json({"Message": "The user attribute cannot be empty"});
    else if (foundUser.length  === 1)
        resp.status(409).json({"Message": "The user is already on the system. Please try another one"});
    else if (name  === "")
        resp.status(400).json({"Message": "The name attribute cannot be empty"});
    else if (email === "")
        resp.status(400).json({"Message": "The email attribute cannot be empty"});
    else if (foundEmail.length === 1)
        resp.status(409).json({"Message": "The email is already on the system. Please try another one"});
    else if (mobile === "")
        resp.status(400).json({"Message": "The mobile attribute cannot be empty"});
    else if (address === "")
        resp.status(400).json({"Message": "The address attribute cannot be empty"});
    else if (password === "")
        resp.status(400).json({"Message": "The password attribute cannot be empty"});
    else
        next();
}

module.exports = validarRegistro;