//@fileoverview: Este es el archivo principal de la app

const express = require('express');
const app = express();

//File System
const fs = require('fs');

//middleware para recursos estaticos
const static = require('express-static');

//middleware para crear la session
const session = require('express-session');
const sessionConfig = JSON.parse(fs.readFileSync('./ArchivosJson/secret.json', 'utf-8'));

//BD
const mongoose = require('mongoose');

//Como la app no esta preparada para leer cookies importamos el cookie-parser
const cookieParser = require('cookie-parser');


//seteamos nuestro motor de plantillas
app.set('view engine', 'ejs');

//Exportamos la variable lista de datos del archivo script.js
const {listaDatos, listaDatosPriv} = require('./scripts/script.js');

//Exportamos funciones desde './controllers/authentication.controller.js'
const { register, login} = require('./controllers/authentication.controller.js')

//Exportamos funciones desde './controllers/authentication.controller.js'
const { privado, publico} = require('./middlewares/authorization.js')


//Iniciamos la session con los datos que le brindamos
app.use(session(sessionConfig));

//inicializamos el bodyParser
const bodyParser = require('body-parser');  

//número del puerto en donde se encuentra escuchando nuestro localhost
const port = 3000;


//Usamos el middelware para los archivos estaticos guardados en la carpeta '/public'
app.use(express.static('public'));
//Estamos usando la via absoluta al directorio en donde van a estar nuestroa archivos estaticos,
// __dirname(C:\Users\david\OneDrive\Desktop\AppDigital) + /public(nuestra carpeta).
app.use('/recursos', express.static(__dirname +'/public'));

//Para que express lea Json hago lo siguiente:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






//-----------------------------Routes------------------------------


//Inicializamos api en donde se vera el archivo index.ejs
app.get('/', publico,(req, res)=>{
    res.render('index');
});

//Inicializamos api en donde se vera el archivo clases.ejs
app.get('/clases',publico, (req, res) => {
    res.render('clases',{listaDatos});
  });

//Inicializamos api en donde se vera el archivo registro ejs
app.get('/registro',publico,(req, res)=>{
    res.render('registro');
});

//Enviamos con un metodo Post la funcion register la cual obtiene los datos del registro y los guarda en la bd
app.post('/api/registro', register);

//Inicializamos api en donde se vera el archivo login ejs
app.get('/login',publico, (req, res)=>{
    res.render('login');
});

//Enviamos con un método Post la función login la cual obtiene los datos del login y los compara en la bd 
app.post('/api/login', login);

app.get('/admin',privado, (req,res)=>{
    res.render('admin', { listaDatosPriv});
});

app.get('/info', privado, (req, res)=>{
    res.render('info');
});




//Conexión MongoDb Atlas
mongoose.connect('mongodb+srv://daviddevito01:ezedv211201@cluster0.2q4j33e.mongodb.net/User?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {console.log('Connected!');
app.listen(port, () => {
    console.log("port 3000")
});})
.catch(()=>{
    console.log("fallo la conexón")
});