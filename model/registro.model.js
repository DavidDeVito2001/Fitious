const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : { 
        required : true, 
        type: String
    },
    email : {
        requerid : true,
        type: String 
    },
    contraseña : {
        requerid: true,
        type: String
    },
    rol : {
        requerid : true,
        type: String
    }

},
{
    timestamps: true,
  });

const user = mongoose.model('user', userSchema);
module.exports = user;