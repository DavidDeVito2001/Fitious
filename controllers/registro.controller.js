const User = require('../model/registro.model.js');

//Create User
const createUser = async (req, res) =>{
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({mesagge: error.mesagge});
    }
};