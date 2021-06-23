class Usuario {

    constructor(user,name,email,mobile,address,password,admins){
        this.user = user;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.password = password;
        this.admins = admins;
    }
}

module.exports = Usuario;