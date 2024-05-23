const fs = require('fs');
const path = require('path');
const pathJson = path.join(__dirname, '../ArchivosJson/data.json');

function leerJson() {
  const contenido = fs.readFileSync(pathJson, 'utf8');
  return JSON.parse(contenido); // Analizar la cadena JSON en un array
}

const listaDatos = leerJson();




module.exports = {
  listaDatos
};