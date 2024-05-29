const usuario = require('../model/registro.model.js')
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ok } = require('assert');

//Inicializamos el dontev para poder compartir las variables de entorno
dotenv.config();

const login = async function (req, res){
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(400).send({status:"ERROR",message:"Los campos estan incompletos"});
  };

  const existeUser = await usuario.findOne({email : email})
  if(!existeUser){
    return res.status(400).send({status:"ERROR", message:"El email o la contraseña son incorrectos"})
  };

  const loginCorrecto = await bcryptjs.compare(password, existeUser.contraseña);
  if(!loginCorrecto){
    return res.status(400).send({status:"ERROR", message:"El email o la contraseña son incorrectos"})
  }
  //generamos el token, lo que hace es firmar el email con nuestra claveSecreta Y le pasamos la variable de entorno del tiempo de expiración del token
  const token = jsonwebtoken.sign({email:existeUser.email},
     process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRATION});

  const cookieOption = {
    //La multiplicación sirvio para que la variable de entorno expire en 1 día
    expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    path : "/" 
  }

  //Mandamos la cookie al cliente con el valor del token que dice que soy el usuario loggeado
  res.cookie("jwt", token, cookieOption);
  res.send({status: ok, message: "Usuario correctamente loggeado", redirect: 'admin'});

};




async function register (req, res){
    
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    // si no tiene usuario o corrreo o contraseña entonces mandar error
    if(!user || !email || !password){
      return res.status(400).send({status :"Error", message:"Los campos están incompletos"});
    }
    
    //@type booleano. Si existe el email en la base la variable es Verdade sino Falsa.
    const existeUser = await usuario.findOne({ email: email });
    if (existeUser) {
      console.log('El email ya esta registrado')
      return res.status(401).json({ message: 'Este correo ya está registrado.' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashContraseña = await bcryptjs.hash(password, salt);

    //Creamos nuevo usuario utilizando el Schema de Mongoose
    const nuevoUsuario = await new usuario({name: user, email: email,contraseña: hashContraseña, rol:"user"});
    (async () => {
        try {
          await nuevoUsuario.save(); //guardamos el nuevo Usuario en la Bd
          console.log('Usuario guardado exitosamente!');
          return res.status(201).json({status:"ok", message:`El usuario ${nuevoUsuario.name} fue existosamente creado`, redirect :'/login'});
        } catch (err) {
          console.error('Error al guardar el usuario:', err);
        }
      })();
};

module.exports = {
    register,
    login
}

