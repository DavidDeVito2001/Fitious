const usuario = require('../model/registro.model.js')
const bcryptjs = require('bcryptjs');



const login = async function (req, res){

};




async function register (req, res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    // si no tiene usuario o corrreo o contraseña entonces mandar error
    if(!user || !email || !password){
        res.status(400).send({status :"Error", message:"Los campos están incompletos"});
    }
    
    const salt = await bcryptjs.genSalt(10);
    const hashContraseña = await bcryptjs.hash(password, salt);

    //Creamos nuevo usuario utilizando el Schema de Mongoose
    const nuevoUsuario = await new usuario({name: user, email: email,contraseña: hashContraseña, rol:"user"});
    (async () => {
        try {
          await nuevoUsuario.save(); //guardamos el nuevo Usuario en la Bd
          console.log('Usuario guardado exitosamente!');
        } catch (err) {
          console.error('Error al guardar el usuario:', err);
        }
      })();
};

module.exports = {
    register
}

