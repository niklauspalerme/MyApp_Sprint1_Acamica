const usuarios = require("../variables/usuarios")

const mostrarUsers = () => {

    let usuarios2 = usuarios

    usuarios2.map(usuario =>{
        return delete usuario.password;
    })

    return usuarios2;

}

module.exports = mostrarUsers;