const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const Usuario = require("./clases/usuario");
const Producto = require ("./clases/producto");
const Pedido = require("./clases/pedido");
const server = express();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Swagger

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Delilah Restó - Sprint #1',
            version: '1.0.0',
            description: 'Una API para gestionar los usuarios, pedidos y productos de Delilah Restó'
        }
    },
    apis: ['./app.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);



///////////////////////////////////////////////////////////////////////////////
//Variables



let usuarios = require("./variables/usuarios");
let productos = require("./variables/productos");
let pedidos = require ("./variables/pedidos");
let paymentMethods = require("./variables/metodosDePago");



///////////////////////////////////////////////////////////////////////////////
//Funciones



// Funcion para mostrar los productos tipo Menu
const mostrarProductos = require("./funciones/mostrarProductos");


//Funcion para obtener la data
const obtenerDateTime = require("./funciones/obtenerDateTime");
//const { parse } = require("path/posix");


//Funcion crear Id basada en el ultimo pedido
const crearIdPedidos = require("./funciones/crearIdPedidos");


//Function caular precio total de un pedido
const calcularPrecioTotalPedido = require("./funciones/calcularPrecioTotalPedido");


//Funcion mostrar la data de los productos en el pedido
const mostrarProductosPedido = require("./funciones/mostrarProductosPedidos");


//Funciuon para mostrar todos los usuario sin su passwrod
const mostrarUsers = require("./funciones/mostrarUsers");



///////////////////////////////////////////////////////////////////////////////
//Middleware



//Middleware Global
server.use(express.json())


//Middleware Global
server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


//Middleware Local - Te permite validar los datos de registro del usuario
const validarRegistro = require ('./middlewarex/validarRegistro');


//Middleware Local - Validar Login
const validarLogin = require ('./middlewarex/validarLogin');


//Middleware Local - Validar Operaciones que solo hace el Admins
const validarAutentificacionAdmins = require('./middlewarex/validarAutentificacionAdmins');


//Middleware Local - Autentificaciones de los usuarios registrados
const validarAutentificacionUsuario = require('./middlewarex/validarAutentificacionUsuario');


//Middleware Local - Validar datos del Producto nuevo por el Admins
const validarDatosProducto = require('./middlewarex/validarDatosProducto');


//Middleware Local - Validar datos del Producto nuevo por el Admins
const validarUriProducto = require('./middlewarex/validarUriProducto');


//Middleware Local - Validar los datos del atributo Price
const validarPrice = require('./middlewarex/validarPrice');


//Middleware Local - Validar los datos del body del pedido 
const validarBodyPedido =  require ('./middlewarex/validarBodyPedido');


//Middleware - Validamos la existencia de los metodos de pagos
const validarMetodoPago = require('./middlewarex/validarMetodoPago');


//Middleware - Validar existencia de pedidos
const validarPedidosExistentes = require('./middlewarex/validarPedidosExistentes');


//Middleware - Validar los datos del pedido a editar
const validarPedidoEdicion = require('./middlewarex/validarPedidoEdicion');


//Middleware - Validar La existencia de ese usuario en el producto
const validarPedidoUsuario = require('./middlewarex/validadPedidoUsuario');




///////////////////////////////////////////////////////////////////////////////
//Endpoints #1 - Sign Up y Login


/**
 * @swagger
 * /signup:
 *  post:
 *    description: Endpoint para registrar el usuario
 *    produces:
 *    - "application/json"
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - in : body
 *      name: body
 *      description: Todos los atributos del body son obligatorios
 *      required: true
 *      example: { "user": "nikyuyo2","name": "Nicolas 2","email": "nikyuyo2@gmail.com", "mobile": "+541122544572", "address":"Caba, Colegiales, Federico Lacroze 2542, Piso 6, Depto 2", "password": "1234567890"}
 *    responses:
 *      201:
 *        description: The user has been created
 *      400:
 *        description: The user/name/email/mobile/address/password attribute cannot be empty
 *      409:
 *        description: The email/user is already on the system. Please try another one
 * 
 */
server.post("/signup", validarRegistro,(req,resp)=>{

    let {user,name,email,mobile,address,password} = req.body;
    let admins = false;

    let usuario = new Usuario (user,name,email,mobile,address,password,admins);
    usuarios.push(usuario)

    resp.status(201).json({"Message": "The user has been created"})
})


/**
 * @swagger
 * /login:
 *  post:
 *    description: Endpoint para poder hacer login o acceder a la aplicación
 *    produces:
 *    - "application/json"
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - in : body
 *      name: body
 *      description: Todos los atributos del body son obligatorios. Puede acceder con el "user" o el "emai"
 *      required: true
 *      example: { user: nikyuyo2, password: "1234567890" }
 *    responses:
 *      200:
 *        description: Login Succesfully
 *      403:
 *        description: The user/email or password incorrect
 * 
 */ 
server.post("/login",validarLogin,(req,resp)=>{

    let {user,password,email} = req.body

    let indexUsuarioEncontrado = usuarios.findIndex(
        (usuario)=> (usuario.user === user || usuario.email === email) && usuario.password == password)
    
        console.log("/login -> Login successfully")
        resp.status(200).json({
            "Message": `Login successfully`,
            "usertoken": indexUsuarioEncontrado
        })
})


/**
 * @swagger
 * /usuarios:
 *  get:
 *    description: Endpoint para poder acceder a todos los usuarios registrados. Solo para el Admins
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    responses:
 *      200:
 *        description: Login Succesfully
 *      401:
 *        description: The user/email or password incorrect
 * 
 */ 
server.get("/usuarios", validarAutentificacionAdmins, (req,resp)=>{
    resp.status(200).json(mostrarUsers())
})


///////////////////////////////////////////////////////////////////////////////
//Endpoints #2 - Productos


/**
 * @swagger
 * /productos:
 *  get:
 *    description: Endpoint para poder mostrar todos los productos disponibles en el Menu
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    responses:
 *      200:
 *        description: Show all the products available
 *      401:
 *        description: Access to requested resource is denied
 * 
 */ 
server.get("/productos",validarAutentificacionUsuario, (req,resp)=>{
    resp.status(200).json(mostrarProductos())
})


/**
 * @swagger
 * /productos:
 *  post:
 *    description: Endpoint para el cual solo el Admins pueda dar de alta un producto
 *    produces:
 *    - "application/json"
 *    consumer:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - in : body
 *      name: body
 *      description: Todos los atributos del body son obligatorios
 *      required: true
 *      example: { name: Hambuguesa Funsión Japo-Me 2, description: "Hamburguesa de 150gr de carne con guacamole, cilandro, tomate, wasabi y lechuga romana", picture: https://live.staticflickr.com/3406/3410455398_6a8829d9fc_b.jpg, price: 835  }
 *    responses:
 *      201:
 *        description: The product has been created
 *      400:
 *        description: The atribute name/description/picture/price cannot be empty
 *      401:
 *        description: Access to requested resource is denied
 *      403:
 *        description: The atribute price must be a number
 * 
 */ 
server.post("/productos",validarAutentificacionAdmins,validarDatosProducto,(req,resp)=>{
    
    let name = req.body.name;
    let description = req.body.description;
    let picture = req.body.picture;
    let price = parseInt(req.body.price);

    //Si no hay productos
    if (productos.length === 0){
        
        let producto = new Producto(1,name,description,picture,price,0);

        productos.push(producto);
        resp.status(201).json({"Message": "The product has been created"});
    } else {

        let posicionUltimoProducto = productos.length -1
        let ultimoProducoId = productos[posicionUltimoProducto].id;
        let nuevoId = ultimoProducoId + 1; 
        let producto = new Producto(nuevoId,name,description,picture,price,0);

        productos.push(producto)
        resp.status(201).json({"Message": "The product has been created"});

    }    
})



/**
 * @swagger
 * /productos/{idProduct}:
 *  put:
 *    description: Endpoint para el cual solo el Admins pueda editar un producto
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: idProduct
 *      in: path
 *      type: number
 *      description: Product id
 *      required: true
 *    - in : body
 *      name: body
 *      description: Todos los atributos del body son obligatorios
 *      required: true
 *      example: { name: Hambuguesa Mega de Cheddar, description: "Hamburguesa de 150gr de carne y Cheddar", price: 740  }
 *    responses:
 *      200:
 *        description: The product has been modified
 *      401:
 *        description: Access to requested resource is denied
 *      403:
 *        description: The attribute price must be a number
 *      404:
 *        description: The product id doesn't exists. Please try a correct one
 *      
 * 
 * 
 */ 
server.put("/productos/:idProduct",validarAutentificacionAdmins,validarUriProducto,validarPrice,(req,resp)=>{

    //Vairable logicas
    let idProduct= parseInt(req.params.idProduct);
    let indexFound = productos.findIndex(product => product.id === idProduct)
    let producto = productos.find(product => product.id === idProduct)

    //Variables a modificar
    let name = req.body.name || producto.name;
    let description = req.body.description || producto.description;
    let picture = req.body.picture || producto.picture;
    let price = req.body.price;

    
    //Si no mandan valor del price
    if (typeof price === 'undefined' ){
        price = producto.price;
        productos[indexFound].name = name;
        productos[indexFound].description = description;
        productos[indexFound].picture = picture;
        productos[indexFound].price = price;
        resp.status(200).json({"Message": `The product with id:${idProduct} has been modified`})

    //Si el price es un string con valor de numeros
    }else if (typeof price === 'string'){
            price = parseInt(price);
            productos[indexFound].name = name;
            productos[indexFound].description = description;
            productos[indexFound].picture = picture;
            productos[indexFound].price = price;
            resp.status(200).json({"Message": `The product with id:${idProduct} has been modified`})

    //Si es un numero
    }else if (typeof price === 'number'){
            productos[indexFound].name = name;
            productos[indexFound].description = description;
            productos[indexFound].picture = picture;
            productos[indexFound].price = price;
            resp.status(200).json({"Message": `The product with id:${idProduct} has been modified`})
    }
})


/**
 * @swagger
 * /productos/{idProduct}:
 *  delete:
 *    description: Endpoint para el cual solo el Admins pueda dar de baja un producto 
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: idProduct
 *      in: path
 *      type: number
 *      description: Product id
 *      required: true
 *    responses:
 *      200:
 *        description: The product has been deleted
 *      401:
 *        description: Access to requested resource is denied
 *      404:
 *        description: The product id doesn't exists. Please try a correct one
 * 
 */ 
server.delete("/productos/:idProduct", validarAutentificacionAdmins, validarUriProducto, (req,resp)=>{

    //Variables logicas
    let idProduct= parseInt(req.params.idProduct);
    let indexFound = productos.findIndex(product => product.id === idProduct)
    
    productos.splice(indexFound,1);

    resp.status(200).json({"Message": `The product with id:${idProduct} has been deleted`})

})



///////////////////////////////////////////////////////////////////////////////
//Endpoints #3 - Pedidos



/**
 * @swagger
 * /pedidos:
 *  post:
 *    description: Endpoint para el cual los usuarios pueden realizar pedidos
 *    produces:
 *    - "application/json"
 *    consumer:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - in : body
 *      name: body
 *      example: { "paymentMethod": "Debito", "address": "CABA, Flores, Bolivia 490, 28", "products": [ {  "idProduct": 1, "quantity": 2 }, { "idProduct": 4, "quantity": 2 } ] }
 *    responses:
 *      201:
 *        description: The order has been created
 *      400:
 *        description: The atribute paymentMethod/address/products cannot be empty
 *      401:
 *        description: Access to requested resource is denied
 *      403:
 *         description: The paymentMethod is invalid, please try with another one
 *      404:
 *        description: The attribute products contain some idProduct doesn't exist on the menu
 * 
 */ 
server.post("/pedidos", validarAutentificacionUsuario, validarBodyPedido,validarMetodoPago,(req,resp)=>{
    
    //Variables de asignación
    let dataTime = obtenerDateTime();
    let state = "Pendiente";
    let {paymentMethod,address} = req.body;
    let user = usuarios[parseInt(req.headers.usertoken)].user;
    let id = crearIdPedidos();
    let totalPrice = calcularPrecioTotalPedido(req.body.products);
    let products = mostrarProductosPedido(req.body.products);

    //Creamos el objeto pedido
    let pedido = new Pedido (state,dataTime,id,totalPrice,user,paymentMethod,address,products);
    pedidos.push(pedido);
    resp.status(201).json({"Message": "The order was created successfully"})
})


/**
 * @swagger
 * /pedidos:
 *  get:
 *    description: Endpoint para poder mostrar todos los pedidos de un usuario determinado
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    responses:
 *      200:
 *        description: Show all the products available
 *      401:
 *        description: Access to requested resource is denied
 */ 
server.get("/pedidos", validarAutentificacionUsuario, (req,resp)=>{

    console.log("usuario user", usuarios[req.headers.usertoken].user)
    console.log("Array pedidos: ",pedidos)

    let pedidos2 = pedidos.filter(pedido => pedido.user === usuarios[req.headers.usertoken].user)

    resp.status(200).json(pedidos2)

})


/**
 * @swagger
 * /pedidos/{idPedido}:
 *  put:
 *    description: Endpoint para que los usuarios registrados puedan editar los productos de su pedido. Siempre y cuando el state del producto sea "Pendiente"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: idPedido
 *      in: path
 *      type: number
 *      description: Pedido id
 *      required: true
 *    - in : body
 *      name: body
 *      example: { "address": "CABA, Colegiales, Paz 468", "paymentMethod": "Credito", "products": [ { "idProduct": 1,"quantity": 2 } ]}
 *    responses:
 *      200:
 *        description: The order has been modified
 *      400:
 *        description: The attribute products/product's quantity cannot be empty
 *      401:
 *        description: Access to requested resource is denied
 *      403:
 *        description: The attribute products/paymentMethod is invalid
 *      404:
 *        description: The Order/products ids doesn't exist
 *      409:
 *        description: The state of the order is already processed / The order is not from this User
 * 
 */ 
server.put("/pedidos/:idPedido", validarAutentificacionUsuario,validarPedidosExistentes,validarPedidoEdicion,validarPedidoUsuario,(req,resp)=>{

    let id= parseInt(req.params.idPedido);
    let indexPedido = pedidos.findIndex(pedido => pedido.id === id);
    let products = req.body.products || []
    let address = req.body.address || pedidos[indexPedido].address;
    let paymentMethod = req.body.paymentMethod || pedidos[indexPedido].paymentMethod;

    if ( Array.isArray(products) === true){

        if(products.length === 0)
            resp.status(400).json({"Message": `The Products of the order ${id} cannot be empty `})
        else{
                
                let existingMethod = paymentMethods.filter(paymentMethodx => paymentMethodx === paymentMethod);

                if(existingMethod.length >0){
                        
                    let totalPrice = calcularPrecioTotalPedido(products);
                    pedidos[indexPedido].address = address;
                    pedidos[indexPedido].paymentMethod = paymentMethod;
                    pedidos[indexPedido].totalPrice = totalPrice;
                    pedidos[indexPedido].products = mostrarProductosPedido(products);
                    resp.status(200).json({"Message": `The order ${id} has been modified`})
                }else{
                    resp.status(403).json({"Message": "The paymentMethod is invalid, please insert another one"})
                }
            
        }
    }else{
      resp.status(403).json({"Message": `The Products of the order ${id} are invalid, please insert another one `})
    }
})



///////////////////////////////////////////////////////////////////////////////
//Endpoints #4 - Pedidos Totales 



/**
 * @swagger
 * /pedidosTotales:
 *  get:
 *    description: Endpoint para poder mostrar todos los pedidos en el sistema. Solo el Admins
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    responses:
 *      200:
 *        description: Show all the products available
 *      401:
 *        description: Access to requested resource is denied
 */ 
server.get("/pedidosTotales", validarAutentificacionAdmins, (req,resp)=>{

    resp.status(200).json(pedidos)
})


/**
 * @swagger
 * /pedidosTotales/{idPedido}/state:
 *  put:
 *    description: Endpoint para modificar el estado de los pedidos. Solo el Admins
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: idPedido
 *      in: path
 *      type: number
 *      description: Pedido id
 *      required: true
 *    - in : body
 *      name: body
 *      example: { "state": "Confirmado"}
 *    responses:
 *      200:
 *        description: The State of the order has been modified
 *      401:
 *        description: Access to requested resource is denied
 *      403:
 *        description: The attribute state is invalid. Please sent a valid state
 *      404:
 *        description: The Order doesn't exist please try with another one
 * 
 */ 
server.put("/pedidosTotales/:idPedido/state", validarAutentificacionAdmins,validarPedidosExistentes, (req,resp)=>{

    let state = req.body.state || ""
    let states = ["Pendiente", "Confirmado", "En preparación", "Enviado", "Entregado"];

    let foundState = states.find( estado=>estado === state)

    if (foundState === undefined)
        resp.status(403).json({"Message": `The attribute state is invalid. Please sent a valid state`,
                                "ValidsStates": "Pendiente, Confirmado, En preparación, Enviado, Entregado"})
    else{

        let id= parseInt(req.params.idPedido);
        let indexPedido = pedidos.findIndex(pedido => pedido.id === id);
        pedidos[indexPedido].state = state;
        resp.status(200).json({"Message": `The State of the order ${id} has been modified`})
    }




})


/**
 * @swagger
 * /pedidosTotales/{idPedido}:
 *  delete:
 *    description: Endpoint para que el Admins pueda eliminar un pedido
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: idPedido
 *      in: path
 *      type: number
 *      description: Pedido id
 *      required: true
 *    responses:
 *      200:
 *        description: The  order has been deleted
 *      401:
 *        description: Access to requested resource is denied
 *      404:
 *        description: The Order doesn't exist please try with another one
 * 
 */ 
 server.delete("/pedidosTotales/:idPedido", validarAutentificacionAdmins, validarPedidosExistentes, (req,resp)=>{

    let id= parseInt(req.params.idPedido);
    let pedidoIndex = pedidos.findIndex(pedido => pedido.id === id);

    pedidos.splice(pedidoIndex,1);

    resp.status(200).json({"Message": `The order ${id} has been deleted`})
})



///////////////////////////////////////////////////////////////////////////////
//Endpoints #5 - Metodos de Pagos


/**
 * @swagger
 * /mediosDePago:
 *  get:
 *    description: Endpoint para poder mostrar todos los medios de pago disponibles. Solo el Admins
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    responses:
 *      200:
 *        description: Show all payment methods available on the system
 *      401:
 *        description: Access to requested resource is denied
 */ 
server.get("/mediosDePago", validarAutentificacionAdmins, (req,resp)=>{
    resp.status(200).json(paymentMethods)
}) 


/**
 * @swagger
 * /mediosDePago:
 *  post:
 *    description: Endpoint para poder agregar nuevos medios de pago. Solo el Admins
 *    produces:
 *    - "application/json"
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - in : body
 *      name: body
 *      example: { "newMethod": "Fiado"}
 *    responses:
 *      200:
 *        description: The new method has been added on the system
 *      400:
 *        description: The newMethod attribute cannot be empty
 *      401:
 *        description: Access to requested resource is denied
 *      409:
 *        description: The newMethod attribute is already on the System. Try with another one
 */ 
server.post("/mediosDePago", validarAutentificacionAdmins,(req,resp)=>{

    let newMethod = req.body.newMethod || ""
    let foundMehtod = paymentMethods.filter( paymentMethodx => paymentMethodx === newMethod)

    if(newMethod === "")
        resp.status(400).json({"Message": "The newMethod attribute cannot be empty"})
    else if (foundMehtod.length > 0)
        resp.status(409).json({"Message": "The newMethod attribute is already on the System. Try with another one"})
    else{
        paymentMethods.push(newMethod);
        resp.status(201).json({"Message": "The new method has been added on the system"})
    }

})


/**
 * @swagger
 * /mediosDePago/{IdMetodoPago}:
 *  put:
 *    description: Endpoint para poder modificar medios de pagos existentes. Solo el Admins
 *    produces:
 *    - "application/json"
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: IdMetodoPago
 *      in: path
 *      type: number
 *      description: Array position of paymentMethods
 *      required: true
 *    - in : body
 *      name: body
 *      example: { "paymentMethod": "Bitcoins"}
 *    responses:
 *      200:
 *        description: The new method has been added on the system
 *      400:
 *        description: The newMethod attribute cannot be empty
 *      401:
 *        description: Access to requested resource is denied
 *      404:
 *        description: The paymentMethod index doesn't exists. Please try with another one"
 *      409:
 *        description: The newMethod attribute is already on the System. Try with another one
 */ 
 server.put("/mediosDePago/:IdMedioPago", validarAutentificacionAdmins,(req,resp)=>{

    let indexMethod = parseInt(req.params.IdMedioPago);
    let paymentMethod = req.body.paymentMethod || ""
    let foundMehtod = paymentMethods.filter( paymentMethodx => paymentMethodx === paymentMethod)


    if(paymentMethods[indexMethod] != undefined) {
        if(paymentMethod === "")
            resp.status(400).json({"Message": "The paymentMethod attribute cannot be empty"})
        else if (foundMehtod.length > 0)
            resp.status(409).json({"Message": "The paymentMethod attribute is already on the System. Try with another one"})
        else{
            paymentMethods[indexMethod]= paymentMethod;
            resp.status(200).json({"Message": "The new method has been modified on the system"})
        }

    }else{
        resp.status(404).json({"Message": "The paymentMethod index doesn't exists. Please try with another one"})
    }
})


/**
 * @swagger
 * /mediosDePago/{IdMetodoPago}:
 *  delete:
 *    description: Endpoint para poder eliminar medios de pagos existentes. Solo el Admins
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: usertoken
 *      in: header
 *      type: number
 *      description: An authorization header
 *      required: true
 *    - name: IdMetodoPago
 *      in: path
 *      type: number
 *      description: Array position of paymentMethods
 *      required: true
 *    responses:
 *      200:
 *        description: The payment has been deleted on the system
 *      401:
 *        description: Access to requested resource is denied
 *      404:
 *        description: The paymentMethod index doesn't exists. Please try with another one"
 */ 
 server.delete("/mediosDePago/:IdMedioPago", validarAutentificacionAdmins,(req,resp)=>{

    let indexMethod = parseInt(req.params.IdMedioPago);


    if(paymentMethods[indexMethod] != undefined) {
       
        paymentMethods = paymentMethods.splice(indexMethod);
        resp.status(200).json({"Message": "The paymenteMethod has been deleted on the system"})

    }else{
        resp.status(404).json({"Message": "The paymentMethod index doesn't exists. Please try with another one"})
    }
})





///////////////////////////////////////////////////////////////////////////////
//Port -Listener



server.listen(8080, (req,resp)=>{
    console.log("The port 8080 is active")
})
