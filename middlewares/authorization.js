//Asi se podemos verificar el token de la cookie
const jsonwebtoken = require('jsonwebtoken');

//Necesitamos acceder a la variable de entorno que esta en .env por eso importamos dotenv
const dotenv = require('dotenv');
//lo inciailizamos
dotenv.config();

//Traemos el model de la bd}
const usuario = require('../model/registro.model.js')

const privado = async function (req, res, next){
    //@type booleano
    const loggeado = await revisarCookie(req);
    if(loggeado) return next(); // == si esta loggeado que pase al siguiente middleware
    return res.redirect('/login'); //sino que vuelva al login

};

const publico = async function (req, res, next){
    //@type booleano
    const loggeado = await revisarCookie(req);
    if(!loggeado) return next(); // == si esta loggeado que pase al siguiente middleware
    return res.redirect('/admin'); //sino que vuelva al home

};

const revisarCookie = async function (req){
    try {
        //@type String. Trae  los datos de la cookie y los corta cuando hay un "; ",
        //busca que la cookie empiece con los caracteres jwt= , corta los primero 4 caracteres "jwt="
        const cookieJWT = req.headers.cookie.split('; ').find(cookie => cookie.startsWith("jwt=")).slice(4);

        //decodificada = { email: 'dario@gmail.com', iat: 1716860985, exp: 1717465785 }, 
        //es el mail con el que inciamos incializamos la cookie y la otra es cuando expira la fecha se entrega en milisegundos
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        
        const existeUser = await usuario.findOne({email : decodificada.email});
        if(!existeUser){
            return false;
        };
          return true;
    } catch{
      return false
    }
};




module.exports = {  
    privado,
    publico
};