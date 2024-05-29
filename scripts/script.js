const fs = require('fs');
const path = require('path');

const pathJson = path.join(__dirname, '../ArchivosJson');


function leerJson() {
  const contenido = fs.readFileSync(pathJson +'/data.json', 'utf8');
  return JSON.parse(contenido); // Analizar la cadena JSON en un array
}

const listaDatos = leerJson();

function leerJsonPrivate(){
  const contenidoPriv = fs.readFileSync(pathJson +'/dataPrivate.json', 'utf8');
  return JSON.parse(contenidoPriv); // Analizar la cadena JSON en un array
}

const listaDatosPriv = leerJsonPrivate();

module.exports = {
  listaDatos,
  listaDatosPriv
};